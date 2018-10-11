import * as fs from "fs";
import { generateUuid } from "ms-rest-js";
import { Aborter } from "./Aborter";
import { PathUpdateAction } from "./generated/lib/models";
import {
  BlobUploadCommonResponse,
  IUploadToBlockBlobOptions
} from "./highlevel.common";
import { PathURL } from "./PathURL";
import { Batch } from "./utils/Batch";
import {
  BLOB_DEFAULT_DOWNLOAD_BLOCK_BYTES,
  BLOCK_BLOB_MAX_BLOCKS,
  BLOCK_BLOB_MAX_STAGE_BLOCK_BYTES,
  BLOCK_BLOB_MAX_UPLOAD_BLOB_BYTES
} from "./utils/constants";
import { generateBlockID } from "./utils/utils.common";

/**
 * ONLY AVAILABLE IN NODE.JS RUNTIME.
 *
 * Uploads a local file in blocks to a block blob.
 *
 * When file size <= 256MB, this method will use 1 upload call to finish the upload.
 * Otherwise, this method will call stageBlock to upload blocks, and finally call commitBlockList
 * to commit the block list.
 *
 * @export
 * @param {Aborter} aborter Create a new Aborter instance with Aborter.none or Aborter.timeout(),
 *                          goto documents of Aborter for more examples about request cancellation
 * @param {string} filePath Full path of local file
 * @param {BlockBlobURL} blockBlobURL BlockBlobURL
 * @param {IUploadToBlockBlobOptions} [options] IUploadToBlockBlobOptions
 * @returns {(Promise<BlobUploadCommonResponse>)} ICommonResponse
 */
export async function uploadFile(
  aborter: Aborter,
  filePath: string,
  fileURL: PathURL,
  options?: IUploadToBlockBlobOptions
): Promise<BlobUploadCommonResponse> {
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
 * Accepts a Node.js Readable stream factory, and uploads in blocks to a block blob.
 * The Readable stream factory must returns a Node.js Readable stream starting from the offset defined. The offset
 * is the offset in the block blob to be uploaded.
 *
 * When buffer length <= 256MB, this method will use 1 upload call to finish the upload.
 * Otherwise, this method will call stageBlock to upload blocks, and finally call commitBlockList
 * to commit the block list.
 *
 * @export
 * @param {Aborter} aborter Create a new Aborter instance with Aborter.none or Aborter.timeout(),
 *                          goto documents of Aborter for more examples about request cancellation
 * @param {(offset: number) => NodeJS.ReadableStream} streamFactory Returns a Node.js Readable stream starting
 *                                                                  from the offset defined
 * @param {number} size Size of the block blob
 * @param {BlockBlobURL} blockBlobURL BlockBlobURL
 * @param {IUploadToBlockBlobOptions} [options] IUploadToBlockBlobOptions
 * @returns {(Promise<BlobUploadCommonResponse>)} ICommonResponse
 */
async function uploadResetableStream(
  aborter: Aborter,
  streamFactory: (offset: number, count?: number) => NodeJS.ReadableStream,
  size: number,
  fileURL: PathURL,
  options: IUploadToBlockBlobOptions = {}
): Promise<BlobUploadCommonResponse> {
  if (!options.blockSize) {
    options.blockSize = 0;
  }
  if (
    options.blockSize < 0 ||
    options.blockSize > BLOCK_BLOB_MAX_UPLOAD_BLOB_BYTES
  ) {
    throw new RangeError(
      `blockSize option must be >= 0 and <= ${BLOCK_BLOB_MAX_UPLOAD_BLOB_BYTES}`
    );
  }
  if (options.blockSize === 0) {
    if (size > BLOCK_BLOB_MAX_STAGE_BLOCK_BYTES * BLOCK_BLOB_MAX_BLOCKS) {
      throw new RangeError(`${size} is too larger to upload to a block blob.`);
    }
    if (size > BLOCK_BLOB_MAX_UPLOAD_BLOB_BYTES) {
      options.blockSize = Math.ceil(size / BLOCK_BLOB_MAX_BLOCKS);
      if (options.blockSize < BLOB_DEFAULT_DOWNLOAD_BLOCK_BYTES) {
        options.blockSize = BLOB_DEFAULT_DOWNLOAD_BLOCK_BYTES;
      }
    }
  }

  const numBlocks: number = Math.floor((size - 1) / options.blockSize) + 1;
  if (numBlocks > BLOCK_BLOB_MAX_BLOCKS) {
    throw new RangeError(
      `The buffer's size is too big or the BlockSize is too small;` +
        `the number of blocks must be <= ${BLOCK_BLOB_MAX_BLOCKS}`
    );
  }

  const blockList: string[] = [];
  const blockIDPrefix = generateUuid();
  let transferProgress: number = 0;

  const batch = new Batch(options.parallelism);
  for (let i = 0; i < numBlocks; i++) {
    batch.addOperation(
      async (): Promise<any> => {
        const blockID = generateBlockID(blockIDPrefix, i);
        const start = options.blockSize! * i;
        const end = i === numBlocks - 1 ? size : start + options.blockSize!;
        const contentLength = end - start;
        blockList.push(blockID);
        await fileURL.update(aborter, PathUpdateAction.Append, {
          contentLength: contentLength.toString(),
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
    position: size
  });
}
