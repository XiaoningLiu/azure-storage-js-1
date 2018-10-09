import * as Models from "../lib/generated/models";
import { Aborter } from "./Aborter";
import { FilesystemOperations } from "./generated/operations";
import { Pipeline } from "./Pipeline";
import { StorageURL } from "./StorageURL";

/**
 * A ServiceURL represents a URL to the Azure Storage Blob service allowing you
 * to manipulate blob containers.
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
   * @param {string} url A URL string pointing to Azure Storage blob service, such as
   *                     "https://myaccount.blob.core.windows.net". You can Append a SAS
   *                     if using AnonymousCredential, such as "https://myaccount.blob.core.windows.net?sasString".
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
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/list-containers2
   *
   * @param {Aborter} aborter Create a new Aborter instance with Aborter.none or Aborter.timeout(),
   *                          goto documents of Aborter for more examples about request cancellation
   * @param {Models.DataLakeStorageErrorFilesystemListOptionalParams} [options]
   * @returns {Promise<Models.FilesystemListResponse>}
   * @memberof ServiceURL
   */
  public async listFileSystemsSegment(
    aborter: Aborter,
    options: Models.FilesystemListOptionalParams = {}
  ): Promise<Models.FilesystemListResponse> {
    return this.serviceContext.list({
      abortSignal: aborter,
      ...options
    });
  }
}
