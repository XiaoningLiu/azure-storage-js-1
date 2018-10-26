import * as fs from "fs";
import { Aborter } from "./Aborter";
import { PathUpdateAction } from "./generated/lib/models";
import * as Models from "./generated/lib/models";
import { IUploadOptions } from "./highlevel.common";
import { PathURL } from "./PathURL";
import { Batch } from "./utils/Batch";
import {
  ADLS_DEFAULT_APPEND_DATA_BYTES,
  ADLS_MAX_APPEND_DATA_BYTES,
  ADLS_MAX_APPEND_DATA_NUMBER,
  ADLS_MAX_FILE_BYTES
} from "./utils/constants";

/**
 * ONLY AVAILABLE IN NODE.JS RUNTIME.
 *
 * Uploads a local file to an Azure Storage ADLSv2 file.
 *
 * This method will call Path Update to upload chunks, and finally call Path Update finally
 * to commit the uploaded data.
 *
 * @export
 * @param {Aborter} aborter Create a new Aborter instance with Aborter.none or Aborter.timeout(),
 *                          goto documents of Aborter for more examples about request cancellation
 * @param {string} filePath Full path of local file
 * @param {PathURL} fileURL A PathURL object pointing to an ADLSv2 file url
 * @param {IUploadOptions} [options] IUploadOptions
 * @returns {(Promise<Models.PathUpdateResponse>)} Models.PathUpdateResponse
 */
export async function uploadLocalFile(
  aborter: Aborter,
  filePath: string,
  fileURL: PathURL,
  options?: IUploadOptions
): Promise<Models.PathUpdateResponse> {
  const size = fs.statSync(filePath).size;
  return uploadResetableStream(
    aborter,
    (offset, count) =>
      fs.createReadStream(filePath, {
        autoClose: true,
        end: count ? offset + count - 1 : Infinity,
        start: offset
      }),
    size,
    fileURL,
    options
  );
}

/**
 * ONLY AVAILABLE IN NODE.JS RUNTIME.
 *
 * Accepts a Node.js Readable stream factory, and uploads in chunks to an Azure Storage ADLSv2 file.
 * The Readable stream factory must returns a Node.js Readable stream starting from the offset defined. The offset
 * is the offset in the ADLSv2 file to be uploaded.
 *
 * This method will call Path Update to upload chunks, and finally call Path Update finally
 * to commit the uploaded data.
 *
 * @export
 * @param {Aborter} aborter Create a new Aborter instance with Aborter.none or Aborter.timeout(),
 *                          goto documents of Aborter for more examples about request cancellation
 * @param {(offset: number) => NodeJS.ReadableStream} streamFactory Returns a Node.js Readable stream starting
 *                                                                  from the offset defined
 * @param {number} size Size of the block blob
 * @param {PathURL} fileURL PathURL A PathURL object pointing to an ADLSv2 file url
 * @param {IUploadOptions} [options] IUploadOptions
 * @returns {(Promise<Models.PathUpdateResponse>)} Models.PathUpdateResponse
 */
async function uploadResetableStream(
  aborter: Aborter,
  streamFactory: (offset: number, count?: number) => NodeJS.ReadableStream,
  size: number,
  fileURL: PathURL,
  options: IUploadOptions = {}
): Promise<Models.PathUpdateResponse> {
  if (!options.blockSize) {
    options.blockSize = 0;
  }
  if (options.blockSize < 0 || options.blockSize > ADLS_MAX_APPEND_DATA_BYTES) {
    throw new RangeError(
      `blockSize option must be >= 0 and <= ${ADLS_MAX_APPEND_DATA_BYTES}`
    );
  }
  if (options.blockSize === 0) {
    if (size > ADLS_MAX_FILE_BYTES) {
      throw new RangeError(
        `${size} is too larger to upload to a block blob, cannot exceed than ${ADLS_MAX_FILE_BYTES}.`
      );
    }
    options.blockSize = Math.ceil(size / ADLS_MAX_APPEND_DATA_NUMBER);
    if (options.blockSize < ADLS_DEFAULT_APPEND_DATA_BYTES) {
      options.blockSize = ADLS_DEFAULT_APPEND_DATA_BYTES;
    }
  }

  const numBlocks: number = Math.floor((size - 1) / options.blockSize) + 1;
  if (numBlocks > ADLS_MAX_APPEND_DATA_NUMBER) {
    throw new RangeError(
      `The buffer's size is too big or the BlockSize is too small;` +
        `the number of blocks must be <= ${ADLS_MAX_APPEND_DATA_NUMBER}`
    );
  }

  // Create file first before uploading
  await fileURL.create(Aborter.none, Models.PathResourceType.File, {
    ifMatch: options.ifMatch,
    ifModifiedSince: options.ifModifiedSince,
    ifNoneMatch: options.ifNoneMatch,
    ifUnmodifiedSince: options.ifUnmodifiedSince,
    xMsCacheControl: options.xMsCacheControl,
    xMsContentDisposition: options.xMsContentDisposition,
    xMsContentEncoding: options.xMsContentEncoding,
    xMsContentLanguage: options.xMsContentLanguage,
    xMsContentType: options.xMsContentType,
    xMsLeaseId: options.xMsLeaseId,
    xMsPermissions: options.xMsPermissions,
    xMsProperties: options.xMsProperties,
    xMsUmask: options.xMsUmask
  });

  let transferProgress: number = 0;

  const batch = new Batch(options.parallelism);
  for (let i = 0; i < numBlocks; i++) {
    batch.addOperation(
      async (): Promise<any> => {
        const start = options.blockSize! * i;
        const end = i === numBlocks - 1 ? size : start + options.blockSize!;
        const contentLength = end - start;
        await fileURL.update(aborter, PathUpdateAction.Append, {
          contentLength,
          position: start,
          requestBody: () => streamFactory(start, contentLength)
        });

        // Update progress after block is successfully uploaded to server, in case of block trying
        transferProgress += contentLength;
        if (options.progress) {
          options.progress({ loadedBytes: transferProgress });
        }
      }
    );
  }
  await batch.do();

  return fileURL.update(aborter, PathUpdateAction.Flush, {
    ifMatch: options.ifMatch,
    ifModifiedSince: options.ifModifiedSince,
    ifNoneMatch: options.ifNoneMatch,
    ifUnmodifiedSince: options.ifUnmodifiedSince,
    position: size,
    retainUncommittedData: options.retainUncommittedData,
    xMsCacheControl: options.xMsCacheControl,
    xMsContentDisposition: options.xMsContentDisposition,
    xMsContentEncoding: options.xMsContentEncoding,
    xMsContentLanguage: options.xMsContentLanguage,
    xMsContentType: options.xMsContentType,
    xMsLeaseId: options.xMsLeaseId,
    xMsPermissions: options.xMsPermissions,
    xMsProperties: options.xMsProperties
  });
}
