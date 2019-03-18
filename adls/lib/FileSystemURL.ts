import { Aborter } from "./Aborter";
import * as Models from "./generated/lib/models";
import { FilesystemOperations, PathOperations } from "./generated/lib/operations";
import { Pipeline } from "./Pipeline";
import { ServiceURL } from "./ServiceURL";
import { StorageURL } from "./StorageURL";
import { appendToURLPath, getFileSystemFromURL } from "./utils/utils.common";

export interface IFileSystemCreateOptions {
  /**
   * User-defined properties to be stored with
   * the filesystem, in the format of a comma-separated list of name and value
   * pairs "n1=v1, n2=v2, ...", where each value is base64 encoded.
   *
   * @type {string}
   * @memberof IFileSystemCreateOptions
   */
  xMsProperties?: string;
}

export interface IFileSystemDeleteOptions {
  /**
   * Optional. A date and time value.
   * Specify this header to perform the operation only if the resource has been
   * modified since the specified date and time.
   *
   * @type {string}
   * @memberof IFileSystemDeleteOptions
   */
  ifModifiedSince?: string;

  /**
   * @member {string} [ifUnmodifiedSince] Optional. A date and time value.
   * Specify this header to perform the operation only if the resource has not
   * been modified since the specified date and time.
   */
  ifUnmodifiedSince?: string;
}

export interface IFileSystemSetPropertiesOptions {
  /**
   * Optional. A date and time value.
   * Specify this header to perform the operation only if the resource has been
   * modified since the specified date and time.
   *
   * @type {string}
   * @memberof IFileSystemSetPropertiesOptions
   */
  ifModifiedSince?: string;

  /**
   * Optional. A date and time value.
   * Specify this header to perform the operation only if the resource has not
   * been modified since the specified date and time.
   *
   * @type {string}
   * @memberof IFileSystemSetPropertiesOptions
   */
  ifUnmodifiedSince?: string;
}

export interface IFileSystemListPathsOptions {
  /**
   * Filters results to paths within the specified
   * directory. An error occurs if the directory does not exist.
   *
   * @type {string}
   * @memberof IFileSystemListPathsOptions
   */
  directory?: string;

  /**
   * The number of paths returned with each
   * invocation is limited. If the number of paths to be returned exceeds this
   * limit, a continuation token is returned in the response header
   * x-ms-continuation. When a continuation token is  returned in the response,
   * it must be specified in a subsequent invocation of the list operation to
   * continue listing the paths.
   *
   * @type {string}
   * @memberof IFileSystemListPathsOptions
   */
  continuation?: string;

  /**
   * An optional value that specifies the maximum
   * number of items to return. If omitted or greater than 5,000, the response
   * will include up to 5,000 items.
   *
   * @type {number}
   * @memberof IFileSystemListPathsOptions
   */
  maxResults?: number;
  /**
   * Optional. Valid only when Hierarchical Namespace
   * is enabled for the account. If "true", the identity values returned in the
   * owner and group fields of each list entry will be transformed from Azure
   * Active Directory Object IDs to User Principal Names.  If "false", the
   * values will be returned as Azure Active Directory Object IDs. The default
   * value is false.
   *
   * @type {boolean}
   * @memberof IFileSystemListPathsOptions
   */
  upn?: boolean;
}

/**
 * A FileSystemURL represents a URL to the Azure Storage ADLS file system allowing you
 * to manipulate file systems.
 *
 * @export
 * @class FileSystemURL
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
   * FileSystem name extracted from url.
   *
   * @type {string}
   * @memberof FileSystemURL
   */
  public readonly fileSystemName: string;

  /**
   * fileSystemOperationsContext provided by protocol layer.
   *
   * @private
   * @type {Service}
   * @memberof FileSystemURL
   */
  private readonly fileSystemOperationsContext: FilesystemOperations;

  /**
   * pathOperationsContext provided by protocol layer.
   *
   * @private
   * @type {PathOperations}
   * @memberof PathURL
   */
  private readonly pathOperationsContext: PathOperations;

  /**
   * Creates an instance of FileSystemURL.
   *
   * @param {string} url A URL string pointing to Azure Storage ADLS service, such as
   *                     "http://myaccount.dfs.core.windows.net".
   * @param {Pipeline} pipeline Call StorageURL.newPipeline() to create a default
   *                            pipeline, or provide a customized pipeline.
   * @memberof FileSystemURL
   */
  constructor(url: string, pipeline: Pipeline) {
    super(url, pipeline);

    // By default, dfs swagger and autorest auto generated code will call encodeURIcomponent to encode the path
    // however, double URI encoding will lead to 403 auth error ( "/" -> "%2F" => "%252F", "$" -> "%24" -> "%2524")
    // One solution is to add ""x-ms-skip-url-encoding": true" to the "path" parameter in the swagger
    // Following workaround is to decode first before encode to avoid the double URI encode issue
    this.fileSystemName = decodeURIComponent(getFileSystemFromURL(url));

    this.fileSystemOperationsContext = new FilesystemOperations(
      this.storageClientContext
    );
    this.pathOperationsContext = new PathOperations(this.storageClientContext);
  }

  /**
   * Creates a new FileSystemURL object identical to the source but with the
   * specified request policy pipeline.
   *
   * @param {Pipeline} pipeline
   * @returns {FileSystemURL}
   * @memberof FileSystemURL
   */
  public withPipeline(pipeline: Pipeline): FileSystemURL {
    return new FileSystemURL(this.url, pipeline);
  }

  /**
   * Create a filesystem rooted at the specified location. If the filesystem already exists, the
   * operation fails. This operation does not support conditional HTTP requests.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/datalakestoragegen2/filesystem/create
   *
   * @param {Aborter} aborter
   * @param {IFileSystemCreateOptions} options
   * @returns {Promise<Models.FilesystemCreateResponse>}
   * @memberof FileSystemURL
   */
  public async create(
    aborter: Aborter,
    options: IFileSystemCreateOptions = {}
  ): Promise<Models.FilesystemCreateResponse> {
    return this.fileSystemOperationsContext.create(this.fileSystemName, {
      abortSignal: aborter,
      ...options
    });
  }

  /**
   * Marks the filesystem for deletion.  When a filesystem is deleted, a filesystem with the same
   * identifier cannot be created for at least 30 seconds. While the filesystem is being deleted,
   * attempts to create a filesystem with the same identifier will fail with status code 409
   * (Conflict), with the service returning additional error information indicating that the
   * filesystem is being deleted. All other operations, including operations on any files or
   * directories within the filesystem, will fail with status code 404 (Not Found) while the
   * filesystem is being deleted. This operation supports conditional HTTP requests.  For more
   * information
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/datalakestoragegen2/filesystem/delete
   *
   * @param {Aborter} aborter
   * @param {IFileSystemDeleteOptions} options
   * @returns {Promise<Models.FilesystemDeleteResponse>}
   * @memberof FileSystemURL
   */
  public async delete(
    aborter: Aborter,
    options: IFileSystemDeleteOptions = {}
  ): Promise<Models.FilesystemDeleteResponse> {
    return this.fileSystemOperationsContext.deleteMethod(this.fileSystemName, {
      abortSignal: aborter,
      ...options
    });
  }

  /**
   * Get Filesystem Properties. All system and user-defined filesystem properties are specified in the response headers.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/datalakestoragegen2/filesystem/getproperties}
   *
   * @param {Aborter} aborter Create a new Aborter instance with Aborter.none or Aborter.timeout(),
   *                          goto documents of Aborter for more examples about request cancellation
   * @returns {Promise<Models.FilesystemGetPropertiesResponse>}
   * @memberof FileSystemURL
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
   * @param {string} properties Optional. User-defined properties to be
   *                            stored with the filesystem, in the format of a comma-separated list of
   *                            name and value pairs "n1=v1, n2=v2, ...", where each value is base64
   *                            encoded.  If the filesystem exists, any properties not included in the
   *                            list will be removed.  All properties are removed if the header is
   *                            omitted.  To merge new and existing properties, first get all existing
   *                            properties and the current E-Tag, then make a conditional request with the
   *                            E-Tag and include values for all properties.
   * @param {IFileSystemSetPropertiesOptions} [options={}]
   * @returns {Promise<Models.FilesystemSetPropertiesResponse>}
   * @memberof FileSystemURL
   */
  public async setProperties(
    aborter: Aborter,
    properties: string,
    options: IFileSystemSetPropertiesOptions = {}
  ): Promise<Models.FilesystemSetPropertiesResponse> {
    return this.fileSystemOperationsContext.setProperties(this.fileSystemName, {
      abortSignal: aborter,
      xMsProperties: properties,
      ...options
    });
  }

  /**
   * List filesystem paths and their properties.
   *
   * @param {Aborter} aborter Create a new Aborter instance with Aborter.none or Aborter.timeout(),
   *                          goto documents of Aborter for more examples about request cancellation
   * @param {boolean} recursive If "true", all paths are listed; otherwise, only paths at the root of the
   * filesystem are listed. If "directory" is specified, the list will only include paths that share
   * the same root.
   * @param {IFileSystemListPathsOptions} [options={}]
   * @returns {Promise<Models.PathListResponse>}
   * @memberof FileSystemURL
   */
  public async listPathsSegment(
    aborter: Aborter,
    recursive: boolean,
    options: IFileSystemListPathsOptions = {}
  ): Promise<Models.PathListResponse> {
    return this.pathOperationsContext.list(recursive, this.fileSystemName, {
      abortSignal: aborter,
      ...options
    });
  }
}
