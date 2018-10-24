import { TransferProgressEvent } from "ms-rest-js";

export interface IUploadOptions {
  /**
   * Block size.
   *
   * @type {number}
   * @memberof IUploadToBlockBlobOptions
   */
  blockSize?: number;

  /**
   * Progress updater.
   *
   * @memberof IUploadToBlockBlobOptions
   */
  progress?: (progress: TransferProgressEvent) => void;

  /**
   * Metadata of block blob.
   *
   * @type {{ [propertyName: string]: string }}
   * @memberof IUploadToBlockBlobOptions
   */
  metadata?: { [propertyName: string]: string };

  /**
   * Concurrency of parallel uploading. Must be > 0.
   *
   * @type {number}
   * @memberof IUploadToBlockBlobOptions
   */
  parallelism?: number;

  /**
   * The lease ID must be specified if there is
   * an active lease.
   *
   * @type {string}
   * @memberof IUploadOptions
   */
  xMsLeaseId?: string;

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
   * @memberof IUploadOptions
   */
  retainUncommittedData?: boolean;

  /**
   * The service stores this value and includes it
   * in the "Cache-Control" response header for "Read File" operations.
   *
   * @type {string}
   * @memberof IUploadOptions
   */
  xMsCacheControl?: string;

  /**
   * The service stores this value and includes it
   * in the "Content-Type" response header for "Read File" operations.
   *
   * @type {string}
   * @memberof IUploadOptions
   */
  xMsContentType?: string;

  /**
   * The service stores this value and includes
   * it in the "Content-Disposition" response header for "Read File"
   * operations.
   *
   * @type {string}
   * @memberof IUploadOptions
   */
  xMsContentDisposition?: string;

  /**
   * The service stores this value and includes
   * it in the "Content-Encoding" response header for "Read File" operations.
   *
   * @type {string}
   * @memberof IUploadOptions
   */
  xMsContentEncoding?: string;

  /**
   * The service stores this value and includes
   * it in the "Content-Language" response header for "Read File" operations.
   *
   * @type {string}
   * @memberof IUploadOptions
   */
  xMsContentLanguage?: string;

  /**
   * User-defined properties to be
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
   * @memberof IUploadOptions
   */
  xMsProperties?: string;

  /**
   * An ETag value. Specify this header to perform
   * the operation only if the resource's ETag matches the value specified. The
   * ETag must be specified in quotes.
   *
   * @type {string}
   * @memberof IUploadOptions
   */
  ifMatch?: string;

  /**
   * An ETag value or the special wildcard ("*")
   * value. Specify this header to perform the operation only if the resource's
   * ETag does not match the value specified. The ETag must be specified in
   * quotes.
   *
   * @type {string}
   * @memberof IUploadOptions
   */
  ifNoneMatch?: string;

  /**
   * A date and time value. Specify
   * this header to perform the operation only if the resource has been
   * modified since the specified date and time.
   *
   * @type {string}
   * @memberof IUploadOptions
   */
  ifModifiedSince?: string;

  /**
   * A date and time value. Specify
   * this header to perform the operation only if the resource has not been
   * modified since the specified date and time.
   *
   * @type {string}
   * @memberof IUploadOptions
   */
  ifUnmodifiedSince?: string;

  /**
   * Optional and only valid if Hierarchical
   * Namespace is enabled for the account. Sets POSIX access permissions for
   * the file owner, the file owning group, and others. Each class may be
   * granted read, write, or execute permission.  The sticky bit is also
   * supported.  Both symbolic (rwxrw-rw-) and 4-digit octal notation (e.g.
   * 0766) are supported.
   *
   * @type {string}
   * @memberof IUploadOptions
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
   * @memberof IUploadOptions
   */
  xMsUmask?: string;
}
