import { Aborter } from "./Aborter";
import * as Models from "./generated/models";
import { FilesystemOperations } from "./generated/operations";
import { Pipeline } from "./Pipeline";
import { ServiceURL } from "./ServiceURL";
import { StorageURL } from "./StorageURL";
import { appendToURLPath, getURLPath } from "./utils/utils.common";

/**
 * A FileSystemURL represents a URL to the Azure Storage ADLS service allowing you
 * to manipulate blob containers.
 *
 * @export
 * @class ServiceURL
 * @extends {StorageURL}
 */
export class FileSystemURL extends StorageURL {
  /**
   * Creates a ContainerURL object from ServiceURL
   * @param serviceURL
   * @param fileSystemName
   */
  public static fromServiceURL(
    serviceURL: ServiceURL,
    fileSystemName: string
  ): FileSystemURL {
    return new FileSystemURL(
      appendToURLPath(serviceURL.url, fileSystemName),
      serviceURL.pipeline
    );
  }

  /**
   * fileSystemOperationsContext provided by protocol layer.
   *
   * @private
   * @type {Service}
   * @memberof ServiceURL
   */
  private readonly fileSystemOperationsContext: FilesystemOperations;

  /**
   * FileSystem name extracted from url.
   *
   * @private
   * @type {string}
   * @memberof FileSystemURL
   */
  private readonly fileSystemName: string;

  /**
   * Creates an instance of ServiceURL.
   * @param {string} url A URL string pointing to Azure Storage blob service, such as
   *                     "http://myaccount.dfs.core.windows.net".
   * @param {Pipeline} pipeline Call StorageURL.newPipeline() to create a default
   *                            pipeline, or provide a customized pipeline.
   * @memberof ServiceURL
   */
  constructor(url: string, pipeline: Pipeline) {
    super(url, pipeline);

    const urlPath = getURLPath(url);
    if (!urlPath) {
      throw new RangeError(`Invalid url "${url}", file system is undefined.`);
    }

    const fileSystemName = urlPath.startsWith("/")
      ? urlPath.substring(1).split("/")[0]
      : urlPath.split("/")[0];
    if (!fileSystemName) {
      throw new RangeError(`Invalid url "${url}", file system is undefined.`);
    }
    this.fileSystemName = fileSystemName;

    this.fileSystemOperationsContext = new FilesystemOperations(
      this.storageClientContext
    );
  }

  /**
   * Creates a new ServiceURL object identical to the source but with the
   * specified request policy pipeline.
   *
   * @param {Pipeline} pipeline
   * @returns {ServiceURL}
   * @memberof ServiceURL
   */
  public withPipeline(pipeline: Pipeline): FileSystemURL {
    return new FileSystemURL(this.url, pipeline);
  }

  /**
   * Get Filesystem Properties. All system and user-defined filesystem properties are specified in the response headers.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/datalakestoragegen2/filesystem/getproperties}
   *
   * @param {Aborter} aborter Create a new Aborter instance with Aborter.none or Aborter.timeout(),
   *                          goto documents of Aborter for more examples about request cancellation
   * @returns {Promise<Models.FilesystemGetPropertiesResponse>}
   * @memberof ServiceURL
   */
  public async getProperties(
    aborter: Aborter
  ): Promise<Models.FilesystemGetPropertiesResponse> {
    return this.fileSystemOperationsContext.getProperties(this.fileSystemName, {
      abortSignal: aborter
    });
  }

  /**
   * Set properties for the filesystem. This operation supports conditional HTTP requests. For more information,
   * see Specifying Conditional Headers for Blob Service Operations.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/datalakestoragegen2/filesystem/setproperties}
   *
   * @param {Aborter} aborter Create a new Aborter instance with Aborter.none or Aborter.timeout(),
   *                          goto documents of Aborter for more examples about request cancellation
   * @param {Models.FilesystemSetPropertiesOptionalParams} properties
   * @returns {Promise<Models.FilesystemSetPropertiesResponse>}
   * @memberof ServiceURL
   */
  public async setProperties(
    aborter: Aborter,
    properties: Models.FilesystemSetPropertiesOptionalParams
  ): Promise<Models.FilesystemSetPropertiesResponse> {
    return this.fileSystemOperationsContext.setProperties(this.fileSystemName, {
      abortSignal: aborter,
      ...properties
    });
  }
}
