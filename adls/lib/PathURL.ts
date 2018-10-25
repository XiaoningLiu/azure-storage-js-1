import { HttpRequestBody, isNode, TransferProgressEvent } from "ms-rest-js";
import { Aborter } from "./Aborter";
import { FileSystemURL } from "./FileSystemURL";
import * as Models from "./generated/lib/models";
import { PathOperations } from "./generated/lib/operations";
import { IRange, rangeToString, stringToRange } from "./IRange";
import { PathReadResponse } from "./PathReadResponse";
import { Pipeline } from "./Pipeline";
import { StorageURL } from "./StorageURL";
import { appendToURLPath, getURLPathComponents } from "./utils/utils.common";

export interface IPathCreateOptions {
  /**
   * Optional.  When renaming a directory, the
   * number of paths that are renamed with each invocation is limited.  If the
   * number of paths to be renamed exceeds this limit, a continuation token is
   * returned in this response header.  When a continuation token is returned
   * in the response, it must be specified in a subsequent invocation of the
   * rename operation to continue renaming the directory.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  continuation?: string;

  /**
   * Optional. Valid only when namespace is
   * enabled. This parameter determines the behavior of the rename operation.
   * The value must be "legacy" or "posix", and the default value will be
   * "posix". Possible values include: 'legacy', 'posix'
   *
   * @type {Models.PathRenameMode}
   * @memberof IPathCreateOptions
   */
  mode?: Models.PathRenameMode;

  /**
   * Optional. The service stores this value
   * and includes it in the "Cache-Control" response header for "Read File"
   * operations for "Read File" operations.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  cacheControl?: string;

  /**
   * Optional. Specifies which content
   * encodings have been applied to the file. This value is returned to the
   * client when the "Read File" operation is performed.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  contentEncoding?: string;

  /**
   * Optional. Specifies the natural
   * language used by the intended audience for the file.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  contentLanguage?: string;

  /**
   * Optional. The service stores this
   * value and includes it in the "Content-Disposition" response header for
   * "Read File" operations.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  contentDisposition?: string;

  /**
   * Optional. The service stores this
   * value and includes it in the "Cache-Control" response header for "Read
   * File" operations.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  xMsCacheControl?: string;

  /**
   * Optional. The service stores this value
   * and includes it in the "Content-Type" response header for "Read File"
   * operations.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  xMsContentType?: string;

  /**
   * Optional. The service stores this
   * value and includes it in the "Content-Encoding" response header for "Read
   * File" operations.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  xMsContentEncoding?: string;

  /**
   * Optional. The service stores this
   * value and includes it in the "Content-Language" response header for "Read
   * File" operations.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  xMsContentLanguage?: string;

  /**
   * Optional. The service stores
   * this value and includes it in the "Content-Disposition" response header
   * for "Read File" operations.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  xMsContentDisposition?: string;

  /**
   * An optional file or directory to be
   * renamed.  The value must have the following format:
   * "/{filesysystem}/{path}".  If "x-ms-properties" is specified, the
   * properties will overwrite the existing properties; otherwise, the existing
   * properties will be preserved.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  xMsRenameSource?: string;

  /**
   * Optional. A lease ID for the path specified
   * in the URI.  The path to be overwritten must have an active lease and the
   * lease ID must match.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  xMsLeaseId?: string;

  /**
   * Optional for create operations.
   * Required when "x-ms-lease-action" is used. A lease will be acquired using
   * the proposed ID when the resource is created.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  xMsProposedLeaseId?: string;

  /**
   * Optional for rename operations.  A
   * lease ID for the source path.  The source path must have an active lease
   * and the lease ID must match.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  xMsSourceLeaseId?: string;

  /**
   * Optional. User-defined properties to be
   * stored with the file or directory, in the format of a comma-separated list
   * of name and value pairs "n1=v1, n2=v2, ...", where each value is base64
   * encoded.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  xMsProperties?: string;

  /**
   * Optional and only valid if Hierarchical
   * Namespace is enabled for the account. Sets POSIX access permissions for
   * the file owner, the file owning group, and others. Each class may be
   * granted read, write, or execute permission.  The sticky bit is also
   * supported.  Both symbolic (rwxrw-rw-) and 4-digit octal notation (e.g.
   * 0766) are supported.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  xMsPermissions?: string;

  /**
   * Optional and only valid if Hierarchical
   * Namespace is enabled for the account. This umask restricts permission
   * settings for file and directory, and will only be applied when default Acl
   * does not exist in parent directory. If the umask bit has set, it means
   * that the corresponding permission will be disabled. Otherwise the
   * corresponding permission will be determined by the permission. A 4-digit
   * octal notation (e.g. 0022) is supported here. If no umask was specified, a
   * default umask - 0027 will be used.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  xMsUmask?: string;

  /**
   * Optional. An ETag value. Specify this header
   * to perform the operation only if the resource's ETag matches the value
   * specified. The ETag must be specified in quotes.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  ifMatch?: string;

  /**
   * Optional. An ETag value or the special
   * wildcard ("*") value. Specify this header to perform the operation only if
   * the resource's ETag does not match the value specified. The ETag must be
   * specified in quotes.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  ifNoneMatch?: string;

  /**
   * Optional. A date and time value.
   * Specify this header to perform the operation only if the resource has been
   * modified since the specified date and time.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  ifModifiedSince?: string;

  /**
   * Optional. A date and time value.
   * Specify this header to perform the operation only if the resource has not
   * been modified since the specified date and time.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  ifUnmodifiedSince?: string;

  /**
   * Optional. An ETag value. Specify this
   * header to perform the rename operation only if the source's ETag matches
   * the value specified. The ETag must be specified in quotes.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  xMsSourceIfMatch?: string;

  /**
   * Optional. An ETag value or the
   * special wildcard ("*") value. Specify this header to perform the rename
   * operation only if the source's ETag does not match the value specified.
   * The ETag must be specified in quotes.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  xMsSourceIfNoneMatch?: string;

  /**
   * Optional. A date and time
   * value. Specify this header to perform the rename operation only if the
   * source has been modified since the specified date and time.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  xMsSourceIfModifiedSince?: string;

  /**
   * Optional. A date and time
   * value. Specify this header to perform the rename operation only if the
   * source has not been modified since the specified date and time.
   *
   * @type {string}
   * @memberof IPathCreateOptions
   */
  xMsSourceIfUnmodifiedSince?: string;
}

export interface IPathUpdateOptions {
  /**
   * Required for "Append Data" and "Flush
   * Data".  Must be 0 for "Flush Data".  Must be the length of the request
   * content in bytes for "Append Data".
   *
   * @type {string}
   * @memberof IPathUpdateOptions
   */
  contentLength?: string;

  /**
   * This parameter allows the caller to upload
   * data in parallel and control the order in which it is appended to the
   * file. It is required when uploading data to be appended to the file and
   * when flushing previously uploaded data to the file.  The value must be the
   * position where the data is to be appended.  Uploaded data is not
   * immediately flushed, or written, to the file.  To flush, the previously
   * uploaded data must be contiguous, the position parameter must be specified
   * and equal to the length of the file after all data has been written, and
   * there must not be a request entity body included with the request.
   *
   * @type {number}
   * @memberof IPathUpdateOptions
   */
  position?: number;

  /**
   * Valid only for flush operations.
   * If "true", uncommitted data is retained after the flush operation
   * completes; otherwise, the uncommitted data is deleted after the flush
   * operation. The default is false. Data at offsets less than the specified
   * position are written to the file when flush succeeds, but this optional
   * parameter allows data after the flush position to be retained for a future
   * flush operation.
   *
   * @type {boolean}
   * @memberof IPathUpdateOptions
   */
  retainUncommittedData?: boolean;

  /**
   * Optional. The lease
   * action can be "renew" to renew an existing lease or "release" to release a
   * lease. Possible values include: 'renew', 'release'
   *
   * @type {Models.PathUpdateLeaseAction}
   * @memberof IPathUpdateOptions
   */
  xMsLeaseAction?: Models.PathUpdateLeaseAction;

  /**
   * Optional. The lease ID must be specified if there is
   * an active lease.
   *
   * @type {string}
   * @memberof IPathUpdateOptions
   */
  xMsLeaseId?: string;

  /**
   * Optional and only valid for flush and
   * set properties operations. The service stores this value and includes it
   * in the "Cache-Control" response header for "Read File" operations.
   *
   * @type {string}
   * @memberof IPathUpdateOptions
   */
  xMsCacheControl?: string;

  /**
   * Optional and only valid for flush and
   * set properties operations. The service stores this value and includes it
   * in the "Content-Type" response header for "Read File" operations.
   *
   * @type {string}
   * @memberof IPathUpdateOptions
   */
  xMsContentType?: string;

  /**
   * Optional and only valid for flush
   * and set properties operations. The service stores this value and includes
   * it in the "Content-Disposition" response header for "Read File"
   * operations.
   *
   * @type {string}
   * @memberof IPathUpdateOptions
   */
  xMsContentDisposition?: string;

  /**
   * Optional and only valid for flush
   * and set properties operations. The service stores this value and includes
   * it in the "Content-Encoding" response header for "Read File" operations.
   *
   * @type {string}
   * @memberof IPathUpdateOptions
   */
  xMsContentEncoding?: string;

  /**
   * Optional and only valid for flush
   * and set properties operations.  The service stores this value and includes
   * it in the "Content-Language" response header for "Read File" operations.
   *
   * @type {string}
   * @memberof IPathUpdateOptions
   */
  xMsContentLanguage?: string;

  /**
   * Optional. User-defined properties to be
   * stored with the file or directory, in the format of a comma-separated list
   * of name and value pairs "n1=v1, n2=v2, ...", where each value is base64
   * encoded.  Valid only for the setProperties operation.  If the file or
   * directory exists, any properties not included in the list will be removed.
   * All properties are removed if the header is omitted.  To merge new and
   * existing properties, first get all existing properties and the current
   * E-Tag, then make a conditional request with the E-Tag and include values
   * for all properties.
   *
   * @type {string}
   * @memberof IPathUpdateOptions
   */
  xMsProperties?: string;

  /**
   * Optional and valid only for the
   * setAccessControl operation. Sets the owner of the file or directory.
   *
   * @type {string}
   * @memberof IPathUpdateOptions
   */
  xMsOwner?: string;

  /**
   * Optional and valid only for the
   * setAccessControl operation. Sets the owning group of the file or
   * directory.
   *
   * @type {string}
   * @memberof IPathUpdateOptions
   */
  xMsGroup?: string;

  /**
   * Optional and only valid if Hierarchical
   * Namespace is enabled for the account. Sets POSIX access permissions for
   * the file owner, the file owning group, and others. Each class may be
   * granted read, write, or execute permission.  The sticky bit is also
   * supported.  Both symbolic (rwxrw-rw-) and 4-digit octal notation (e.g.
   * 0766) are supported. Invalid in conjunction with x-ms-acl.
   *
   * @type {string}
   * @memberof IPathUpdateOptions
   */
  xMsPermissions?: string;

  /**
   * Optional and valid only for the setAccessControl
   * operation. Sets POSIX access control rights on files and directories. The
   * value is a comma-separated list of access control entries that fully
   * replaces the existing access control list (ACL). Each access control
   * entry (ACE) consists of a scope, a type, a user or group identifier, and
   * permissions in the format "[scope:][type]:[id]:[permissions]". The scope
   * must be "default" to indicate the ACE belongs to the default ACL for a
   * directory; otherwise scope is implicit and the ACE belongs to the access
   * ACL.  There are four ACE types: "user" grants rights to the owner or a
   * named user, "group" grants rights to the owning group or a named group,
   * "mask" restricts rights granted to named users and the members of groups,
   * and "other" grants rights to all users not found in any of the other
   * entries. The user or group identifier is omitted for entries of type
   * "mask" and "other".  The user or group identifier is also omitted for the
   * owner and owning group.  The permission field is a 3-character sequence
   * where the first character is 'r' to grant read access, the second
   * character is 'w' to grant write access, and the third character is 'x' to
   * grant execute permission.  If access is not granted, the '-' character is
   * used to denote that the permission is denied. For example, the following
   * ACL grants read, write, and execute rights to the file owner and
   * john.doe@contoso, the read right to the owning group, and nothing to
   * everyone else:
   * "user::rwx,user:john.doe@contoso:rwx,group::r--,other::---,mask=rwx".
   * Invalid in conjunction with x-ms-permissions.
   *
   * @type {string}
   * @memberof IPathUpdateOptions
   */
  xMsAcl?: string;

  /**
   * Optional for Flush Data and Set Properties, but
   * invalid for Append Data.  An ETag value. Specify this header to perform
   * the operation only if the resource's ETag matches the value specified. The
   * ETag must be specified in quotes.
   *
   * @type {string}
   * @memberof IPathUpdateOptions
   */
  ifMatch?: string;

  /**
   * Optional for Flush Data and Set Properties,
   * but invalid for Append Data.  An ETag value or the special wildcard ("*")
   * value. Specify this header to perform the operation only if the resource's
   * ETag does not match the value specified. The ETag must be specified in
   * quotes.
   *
   * @type {string}
   * @memberof IPathUpdateOptions
   */
  ifNoneMatch?: string;

  /**
   * Optional for Flush Data and Set
   * Properties, but invalid for Append Data. A date and time value. Specify
   * this header to perform the operation only if the resource has been
   * modified since the specified date and time.
   *
   * @type {string}
   * @memberof IPathUpdateOptions
   */
  ifModifiedSince?: string;

  /**
   * Optional for Flush Data and Set
   * Properties, but invalid for Append Data. A date and time value. Specify
   * this header to perform the operation only if the resource has not been
   * modified since the specified date and time.
   *
   * @type {string}
   * @memberof IPathUpdateOptions
   */
  ifUnmodifiedSince?: string;

  /**
   * Valid only for append
   * operations. The data to be uploaded and appended to the file.
   *
   * @type {HttpRequestBody}
   * @memberof IPathUpdateOptions
   */
  requestBody?: HttpRequestBody;
}

export interface IPathLeaseOptions {
  /**
   *  The lease duration is required to
   * acquire a lease, and specifies the duration of the lease in seconds. The
   * lease duration must be between 15 and 60 seconds or -1 for infinite lease.
   *
   * @type {number}
   * @memberof IPathLeaseOptions
   */
  xMsLeaseDuration?: number;

  /**
   *  The lease break period duration is
   * optional to break a lease, and  specifies the break period of the lease in
   * seconds.  The lease break  duration must be between 0 and 60 seconds.
   *
   * @type {number}
   * @memberof IPathLeaseOptions
   */
  xMsLeaseBreakPeriod?: number;

  /**
   *  Required when "x-ms-lease-action" is
   * "renew", "change" or "release". For the renew and release actions, this
   * must match the current lease ID.
   *
   * @type {string}
   * @memberof IPathLeaseOptions
   */
  xMsLeaseId?: string;

  /**
   *  Required when "x-ms-lease-action" is
   * "acquire" or "change".  A lease will be acquired with this lease ID if the
   * operation is successful.
   *
   * @type {string}
   * @memberof IPathLeaseOptions
   */
  xMsProposedLeaseId?: string;

  /**
   * Optional. An ETag value. Specify this header
   * to perform the operation only if the resource's ETag matches the value
   * specified. The ETag must be specified in quotes.
   *
   * @type {string}
   * @memberof IPathLeaseOptions
   */
  ifMatch?: string;

  /**
   * Optional. An ETag value or the special
   * wildcard ("*") value. Specify this header to perform the operation only if
   * the resource's ETag does not match the value specified. The ETag must be
   * specified in quotes.
   *
   * @type {string}
   * @memberof IPathLeaseOptions
   */
  ifNoneMatch?: string;

  /**
   * Optional. A date and time value.
   * Specify this header to perform the operation only if the resource has been
   * modified since the specified date and time.
   *
   * @type {string}
   * @memberof IPathLeaseOptions
   */
  ifModifiedSince?: string;

  /**
   * Optional. A date and time value.
   * Specify this header to perform the operation only if the resource has not
   * been modified since the specified date and time.
   *
   * @type {string}
   * @memberof IPathLeaseOptions
   */
  ifUnmodifiedSince?: string;
}

export interface IPathReadOptions {
  /**
   * The HTTP Range request header specifies one or
   * more byte ranges of the resource to be retrieved.
   *
   * @type {(IRange | string)}
   * @memberof IPathReadOptions
   */
  range?: IRange | string;

  /**
   * Optional. An ETag value. Specify this header
   * to perform the operation only if the resource's ETag matches the value
   * specified. The ETag must be specified in quotes.
   *
   * @type {string}
   * @memberof IPathReadOptions
   */
  ifMatch?: string;

  /**
   * Optional. An ETag value or the special
   * wildcard ("*") value. Specify this header to perform the operation only if
   * the resource's ETag does not match the value specified. The ETag must be
   * specified in quotes.
   *
   * @type {string}
   * @memberof IPathReadOptions
   */
  ifNoneMatch?: string;

  /**
   * Optional. A date and time value.
   * Specify this header to perform the operation only if the resource has been
   * modified since the specified date and time.
   *
   * @type {string}
   * @memberof IPathReadOptions
   */
  ifModifiedSince?: string;

  /**
   * Optional. A date and time value.
   * Specify this header to perform the operation only if the resource has not
   * been modified since the specified date and time.
   *
   * @type {string}
   * @memberof IPathReadOptions
   */
  ifUnmodifiedSince?: string;

  /**
   * Optional. ONLY AVAILABLE IN NODE.JS.
   *
   * How many retries will perform when original body download stream unexpected ends.
   * Above kinds of ends will not trigger retry policy because they doesn't emit network errors.
   * With this option, every additional retry means an additional PathURL.read() request will be made
   * until the requested range has been successfully downloaded.
   *
   * Default value is 5, please set a larger value when loading large files in poor network.
   *
   * @type {number}
   * @memberof IPathReadOptions
   */
  maxRetries?: number;

  /**
   * Data transfer progress event handler.
   *
   * @memberof IPathReadOptions
   */
  progress?: (progress: TransferProgressEvent) => void;
}

export interface IPathGetPropertiesOptions {
  /**
   * Optional. An ETag value. Specify this header
   * to perform the operation only if the resource's ETag matches the value
   * specified. The ETag must be specified in quotes.
   *
   * @type {string}
   * @memberof IPathReadOptions
   */
  ifMatch?: string;

  /**
   * Optional. An ETag value or the special
   * wildcard ("*") value. Specify this header to perform the operation only if
   * the resource's ETag does not match the value specified. The ETag must be
   * specified in quotes.
   *
   * @type {string}
   * @memberof IPathReadOptions
   */
  ifNoneMatch?: string;

  /**
   * Optional. A date and time value.
   * Specify this header to perform the operation only if the resource has been
   * modified since the specified date and time.
   *
   * @type {string}
   * @memberof IPathReadOptions
   */
  ifModifiedSince?: string;

  /**
   * Optional. A date and time value.
   * Specify this header to perform the operation only if the resource has not
   * been modified since the specified date and time.
   *
   * @type {string}
   * @memberof IPathReadOptions
   */
  ifUnmodifiedSince?: string;
}

export interface IPathDeleteOptions {
  /**
   * Required and valid only when the resource is
   * a directory.  If "true", all paths beneath the directory will be deleted.
   * If "false" and the directory is non-empty, an error occurs.
   *
   * @type {boolean}
   * @memberof IPathDeleteOptions
   */
  recursive?: boolean;

  /**
   * Optional. When deleting a directory, the
   * number of paths that are deleted with each invocation is limited.  If the
   * number of paths to be deleted exceeds this limit, a continuation token is
   * returned in this response header.  When a continuation token is returned
   * in the response, it must be specified in a subsequent invocation of the
   * delete operation to continue deleting the directory.
   *
   * @type {string}
   * @memberof IPathDeleteOptions
   */
  continuation?: string;

  /**
   * The lease ID must be specified if there is
   * an active lease.
   *
   * @type {string}
   * @memberof IPathDeleteOptions
   */
  xMsLeaseId?: string;

  /**
   * Optional. An ETag value. Specify this header
   * to perform the operation only if the resource's ETag matches the value
   * specified. The ETag must be specified in quotes.
   *
   * @type {string}
   * @memberof IPathReadOptions
   */
  ifMatch?: string;

  /**
   * Optional. An ETag value or the special
   * wildcard ("*") value. Specify this header to perform the operation only if
   * the resource's ETag does not match the value specified. The ETag must be
   * specified in quotes.
   *
   * @type {string}
   * @memberof IPathReadOptions
   */
  ifNoneMatch?: string;

  /**
   * Optional. A date and time value.
   * Specify this header to perform the operation only if the resource has been
   * modified since the specified date and time.
   *
   * @type {string}
   * @memberof IPathReadOptions
   */
  ifModifiedSince?: string;

  /**
   * Optional. A date and time value.
   * Specify this header to perform the operation only if the resource has not
   * been modified since the specified date and time.
   *
   * @type {string}
   * @memberof IPathReadOptions
   */
  ifUnmodifiedSince?: string;
}

/**
 * A PathURL represents a URL to the Azure Storage ADLS path allowing you
 * to manipulate directories or files under a file system.
 *
 * @export
 * @class PathURL
 * @extends {StorageURL}
 */
export class PathURL extends StorageURL {
  /**
   * Creates a PathURL object from FileSystemURL
   *
   * @static
   * @param {FileSystemURL} fileSystemURL
   * @param {string} path Path to a directory or file
   * @returns {PathURL}
   * @memberof PathURL
   */
  public static fromFileSystemURL(
    fileSystemURL: FileSystemURL,
    path: string
  ): PathURL {
    return new PathURL(
      appendToURLPath(fileSystemURL.url, path),
      fileSystemURL.pipeline
    );
  }

  /**
   * Creates a PathURL object from PathURL which pointing to a directory.
   *
   * @static
   * @param {PathURL} pathURL
   * @param {string} path Relative Path to a directory
   * @returns {PathURL}
   * @memberof PathURL
   */
  public static fromPathURL(pathURL: PathURL, path: string): PathURL {
    return new PathURL(appendToURLPath(pathURL.url, path), pathURL.pipeline);
  }

  /**
   * FileSystem name extracted from url.
   *
   * @type {string}
   * @memberof FileSystemURL
   */
  public readonly fileSystemName: string;

  /**
   * Path extracted from url.
   *
   * @type {string}
   * @memberof PathURL
   */
  public readonly path: string;

  /**
   * pathOperationsContext provided by protocol layer.
   *
   * @private
   * @type {PathOperations}
   * @memberof PathURL
   */
  private readonly pathOperationsContext: PathOperations;

  /**
   * Creates an instance of PathURL.
   *
   * @param {string} url A URL string pointing to Azure Storage ADLS directory or file, such as
   *                     "http://myaccount.dfs.core.windows.net/myfilesystem/directory/file".
   * @param {Pipeline} pipeline Call StorageURL.newPipeline() to create a default
   *                            pipeline, or provide a customized pipeline.
   * @memberof PathURL
   */
  constructor(url: string, pipeline: Pipeline) {
    super(url, pipeline);

    const urlPathComponents = getURLPathComponents(url);

    this.fileSystemName = urlPathComponents[0];
    if (!this.fileSystemName) {
      throw new RangeError(`Invalid url "${url}", file system is undefined.`);
    }

    this.path = urlPathComponents.slice(1).join("/");
    if (!this.path) {
      throw new RangeError(`Invalid url "${url}", path is undefined.`);
    }

    this.pathOperationsContext = new PathOperations(this.storageClientContext);
  }

  /**
   * Creates a new PathURL object identical to the source but with the
   * specified request policy pipeline.
   *
   * @param {Pipeline} pipeline
   * @returns {PathURL}
   * @memberof PathURL
   */
  public withPipeline(pipeline: Pipeline): PathURL {
    return new PathURL(this.url, pipeline);
  }

  /**
   * Create or rename a file or directory.
   *
   * @summary Create File | Create Directory | Rename File | Rename Directory
   *
   * By default, the destination is overwritten and if the
   * destination already exists and has a lease the lease is broken. This operation supports
   * conditional HTTP requests.
   * To fail if the destination already exists, use a conditional request with If-None-Match: "*".
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/datalakestoragegen2/path/create
   *
   * @param {Aborter} aborter Create a new Aborter instance with Aborter.none or Aborter.timeout(),
   *                          goto documents of Aborter for more examples about request cancellation
   * @param {Models.PathResourceType} [resource] Required only for Create File and
   * Create Directory. The value must be "file" or "directory".
   * @param {IPathCreateOptions} [options={}]
   * @returns {Promise<Models.PathCreateResponse>}
   * @memberof PathURL
   */
  public async create(
    aborter: Aborter,
    resource?: Models.PathResourceType,
    options: IPathCreateOptions = {}
  ): Promise<Models.PathCreateResponse> {
    return this.pathOperationsContext.create(this.fileSystemName, this.path, {
      abortSignal: aborter,
      resource,
      ...options
    });
  }

  /**
   * Uploads data to be appended to a file, flushes (writes) previously uploaded data to a file, sets
   * properties for a file or directory, or sets access control for a file or directory. Data can
   * only be appended to a file. This operation supports conditional HTTP requests.
   *
   * @summary Append Data | Flush Data | Set Properties | Set Access Control
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/datalakestoragegen2/path/update
   *
   * @param {Aborter} aborter  Create a new Aborter instance with Aborter.none or Aborter.timeout(),
   *                          goto documents of Aborter for more examples about request cancellation
   * @param {Models.PathUpdateAction} action The action must be "append" to upload data to be appended to a file,
   *                                         "flush" to flush previously uploaded data to a file, "setProperties"
   *                                         to set the properties of a file or directory, or "setAccessControl"
   *                                         to set the owner, group, permissions, or access control list for
   *                                         a file or directory.  Note that Hierarchical Namespace must be enabled for
   *                                         the account in order to use access control.
   *                                         Also note that the Access Control List (ACL) includes permissions
   *                                         for the owner, owning group, and others, so the x-ms-permissions and
   *                                         x-ms-acl request headers are mutually exclusive.
   *                                         Possible values include: 'append', 'flush', 'setProperties',
   *                                         'setAccessControl'
   * @param {IPathUpdateOptions} [options={}]
   * @returns {Promise<Models.PathUpdateResponse>}
   * @memberof PathURL
   */
  public async update(
    aborter: Aborter,
    action: Models.PathUpdateAction,
    options: IPathUpdateOptions = {}
  ): Promise<Models.PathUpdateResponse> {
    return this.pathOperationsContext.update(
      action,
      this.fileSystemName,
      this.path,
      {
        abortSignal: aborter,
        ...options
      }
    );
  }

  /**
   * Create and manage a lease to restrict write and delete access to the path. This operation
   * supports conditional HTTP requests.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/datalakestoragegen2/path/lease
   *
   * @param {Aborter} aborter Create a new Aborter instance with Aborter.none or Aborter.timeout(),
   *                          goto documents of Aborter for more examples about request cancellation
   * @param {Models.PathLeaseAction} action  There are five lease actions: "acquire", "break", "change", "renew", and
   *                                         "release". Use "acquire" and specify the "x-ms-proposed-lease-id" and
   *                                         "x-ms-lease-duration" to acquire a new lease. Use "break" to break an
   *                                         existing lease. When a lease is broken, the lease break period is allowed
   *                                         to elapse, during which time no lease operation except break and release
   *                                         can be performed on the file. When a lease is successfully broken, the
   *                                         response indicates the interval in seconds until a new lease can be
   *                                         acquired. Use "change" and specify the current lease ID in "x-ms-lease-id"
   *                                         and the new lease ID in "x-ms-proposed-lease-id" to change the lease ID of
   *                                         an active lease. Use "renew" and specify the "x-ms-lease-id" to renew an
   *                                         existing lease. Use "release" and specify the "x-ms-lease-id" to release a
   *                                         lease. Possible values include: 'acquire', 'break', 'change', 'renew',
   *                                         'release'
   * @param {IPathLeaseOptions} [options={}]
   * @returns {Promise<Models.PathLeaseResponse>}
   * @memberof PathURL
   */
  public async lease(
    aborter: Aborter,
    action: Models.PathLeaseAction,
    options: IPathLeaseOptions = {}
  ): Promise<Models.PathLeaseResponse> {
    return this.pathOperationsContext.lease(
      action,
      this.fileSystemName,
      this.path,
      {
        abortSignal: aborter,
        ...options
      }
    );
  }

  /**
   * Read the contents of a file. For read operations, range requests are supported. This operation
   * supports conditional HTTP requests.
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/datalakestoragegen2/path/read
   *
   * @param {Aborter} aborter Create a new Aborter instance with Aborter.none or Aborter.timeout(),
   *                          goto documents of Aborter for more examples about request cancellation
   * @param {IPathReadOptions} [options={}]
   * @returns {Promise<Models.PathReadResponse>}
   * @memberof PathURL
   */
  public async read(
    aborter: Aborter,
    options: IPathReadOptions = {}
  ): Promise<Models.PathReadResponse> {
    let range: string | undefined;
    if (typeof options.range === "string") {
      range = options.range;
    } else if (options.range) {
      range = rangeToString(options.range);
    }

    const internalOptions: Models.PathReadOptionalParams = {
      abortSignal: aborter,
      ifMatch: options.ifMatch,
      ifModifiedSince: options.ifModifiedSince,
      ifNoneMatch: options.ifNoneMatch,
      ifUnmodifiedSince: options.ifUnmodifiedSince,
      range
    };

    // Leverage build-in progress handler for browsers
    if (!isNode) {
      internalOptions.onDownloadProgress = options.progress;
    }

    const response = await this.pathOperationsContext.read(
      this.fileSystemName,
      this.path,
      internalOptions
    );

    if (!isNode) {
      return response;
    }

    // We support retrying when download stream unexpected ends in Node.js runtime
    // Following code shouldn't be bundled into browser bundle, however some
    // bundlers may try to bundle following code and "PathReadResponse.ts".
    // In this case, "PathReadResponse.browser.ts" will be used as a shim of "PathReadResponse.ts"
    // The config is in package.json "browser" field
    if (!response.contentLength) {
      throw new RangeError(
        `Path read response doesn't contain valid content length header`
      );
    }

    let offset = 0; // Default offset
    let count = Number.parseInt(response.contentLength); // Count to read
    if (range) {
      const rangeObject = stringToRange(range);
      offset = rangeObject.offset;
      count = rangeObject.count ? rangeObject.count : count;
    }

    return new PathReadResponse(
      aborter,
      response,
      async (start: number): Promise<NodeJS.ReadableStream> => {
        const updatedOptions: Models.PathReadOptionalParams = {
          ifMatch: response.eTag,
          ifModifiedSince: options.ifModifiedSince,
          ifNoneMatch: options.ifNoneMatch,
          ifUnmodifiedSince: options.ifUnmodifiedSince,
          range: rangeToString({
            count: offset + count - start + 1,
            offset: start
          })
        };

        // console.log(
        //   `Path.read() options for next retry: ${JSON.stringify(updatedOptions)}`
        // );

        return (await this.pathOperationsContext.read(
          this.fileSystemName,
          this.path,
          { abortSignal: aborter, ...updatedOptions }
        )).readableStreamBody!;
      },
      offset,
      offset + count - 1,
      options.maxRetries,
      options.progress
    );
  }

  /**
   * Get the properties for a file or directory, and optionally include the access control list.
   * This operation supports conditional HTTP requests.
   *
   * @summary Get Properties | Get Access Control List
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/datalakestoragegen2/path/getproperties
   *
   * @param {Aborter} aborter Create a new Aborter instance with Aborter.none or Aborter.timeout(),
   *                          goto documents of Aborter for more examples about request cancellation
   * @param {Models.PathGetPropertiesAction} [action] Optional. If the value is
   * "getAccessControl" the access control list is returned in the response
   * headers (Hierarchical Namespace must be enabled for the account). Possible
   * values include: 'getAccessControl'
   * @param {IPathGetPropertiesOptions} [options={}]
   * @returns {Promise<Models.PathGetPropertiesResponse>}
   * @memberof PathURL
   */
  public async getProperties(
    aborter: Aborter,
    action?: Models.PathGetPropertiesAction,
    options: IPathGetPropertiesOptions = {}
  ): Promise<Models.PathGetPropertiesResponse> {
    return this.pathOperationsContext.getProperties(
      this.fileSystemName,
      this.path,
      {
        abortSignal: aborter,
        action,
        ...options
      }
    );
  }

  /**
   * Delete the file or directory. This operation supports conditional HTTP requests.
   *
   * @summary Delete File | Delete Directory
   *
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/datalakestoragegen2/path/delete
   *
   * @param {Aborter} aborter
   * @param {IPathDeleteOptions} [options={}]
   * @returns {Promise<Models.PathDeleteResponse>}
   * @memberof PathURL
   */
  public async delete(
    aborter: Aborter,
    options: IPathDeleteOptions = {}
  ): Promise<Models.PathDeleteResponse> {
    return this.pathOperationsContext.deleteMethod(
      this.fileSystemName,
      this.path,
      {
        abortSignal: aborter,
        ...options
      }
    );
  }
}
