import * as Models from "../lib/generated/lib/models";
import { Aborter } from "./Aborter";
import { FilesystemOperations } from "./generated/lib/operations";
import { Pipeline } from "./Pipeline";
import { StorageURL } from "./StorageURL";

export interface IServiceListFileSystemsSegmentOptions {
  /**
   * Filters results to file systems within the
   * specified prefix.
   *
   * @type {string}
   * @memberof IServiceListFileSystemsSegmentOptions
   */
  prefix?: string;

  /**
   * An optional value that specifies the maximum
   * number of items to return. If omitted or greater than 5,000, the response
   * will include up to 5,000 items.
   *
   * @type {number}
   * @memberof IServiceListFileSystemsSegmentOptions
   */
  maxResults?: number;
}

/**
 * A ServiceURL represents a URL to the Azure Storage ADLS service allowing you
 * to manipulate ADLS service.
 *
 * @export
 * @class ServiceURL
 * @extends {StorageURL}
 */
export class ServiceURL extends StorageURL {
  /**
   * serviceContext provided by protocol layer.
   *
   * @private
   * @type {Service}
   * @memberof ServiceURL
   */
  private serviceContext: FilesystemOperations;

  /**
   * Creates an instance of ServiceURL.
   * @param {string} url A URL string pointing to Azure Storage ADLS service, such as
   *                     "https://myaccount.dfs.core.windows.net". You can Append a SAS
   *                     if using AnonymousCredential, such as "https://myaccount.dfs.core.windows.net?sasString".
   * @param {Pipeline} pipeline Call StorageURL.newPipeline() to create a default
   *                            pipeline, or provide a customized pipeline.
   * @memberof ServiceURL
   */
  constructor(url: string, pipeline: Pipeline) {
    super(url, pipeline);
    this.serviceContext = new FilesystemOperations(this.storageClientContext);
  }

  /**
   * Creates a new ServiceURL object identical to the source but with the
   * specified request policy pipeline.
   *
   * @param {Pipeline} pipeline
   * @returns {ServiceURL}
   * @memberof ServiceURL
   */
  public withPipeline(pipeline: Pipeline): ServiceURL {
    return new ServiceURL(this.url, pipeline);
  }

  /**
   * Returns a list of the containers under the specified account.
   *
   * @param {Aborter} aborter Create a new Aborter instance with Aborter.none or Aborter.timeout(),
   *                          goto documents of Aborter for more examples about request cancellation
   * @param {string} [continuation] The number of file systems returned with
   * each invocation is limited. If the number of file systems to be returned
   * exceeds this limit, a continuation token is returned in the response
   * header x-ms-continuation. When a continuation token is  returned in the
   * response, it must be specified in a subsequent invocation of the list
   * operation to continue listing the file systems.
   * @param {IServiceListFileSystemsSegmentOptions} [options={}]
   * @returns {Promise<Models.FilesystemListResponse>}
   * @memberof ServiceURL
   */
  public async listFileSystemsSegment(
    aborter: Aborter,
    continuation?: string,
    options: IServiceListFileSystemsSegmentOptions = {}
  ): Promise<Models.FilesystemListResponse> {
    const response = await this.serviceContext.list({
      abortSignal: aborter,
      continuation,
      ...options
    });

    // TODO: swagger issue "definitions" -> "Filesystem" -> "properties" -> "eTag" should be "etag"
    if (response._response && response._response.bodyAsText) {
      const responseJSON = JSON.parse(response._response.bodyAsText);
      if (responseJSON["filesystems"] && response.filesystems) {
        const etags: { [key: string]: string } = {};
        responseJSON["filesystems"].forEach(
          (filesystem: { name: string; etag: string }) => {
            etags[filesystem.name] = filesystem.etag;
          }
        );
        response.filesystems.forEach(filesystem => {
          filesystem.eTag = etags[filesystem.name!];
        });
      }
    }

    return response;
  }
}
