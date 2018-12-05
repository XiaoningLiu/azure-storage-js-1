/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

import * as msRest from "ms-rest-js";
import * as Models from "../models";
import * as Mappers from "../models/pageBlobMappers";
import * as Parameters from "../models/parameters";
import { StorageClientContext } from "../storageClientContext";

/** Class representing a PageBlob. */
export class PageBlob {
  private readonly client: StorageClientContext;

  /**
   * Create a PageBlob.
   * @param {StorageClientContext} client Reference to the service client.
   */
  constructor(client: StorageClientContext) {
    this.client = client;
  }

  /**
   * The Create operation creates a new page blob.
   *
   * @param {number} contentLength The length of the request.
   *
   * @param {number} blobContentLength This header specifies the maximum size for the page blob, up
   * to 1 TB. The page blob size must be aligned to a 512-byte boundary.
   *
   * @param {PageBlobCreateOptionalParams} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse} The deserialized result object.
   *
   * @reject {Error|ServiceError} The error object.
   */
  create(contentLength: number, blobContentLength: number): Promise<Models.PageBlobCreateResponse>;
  create(contentLength: number, blobContentLength: number, options: Models.PageBlobCreateOptionalParams): Promise<Models.PageBlobCreateResponse>;
  create(contentLength: number, blobContentLength: number, callback: msRest.ServiceCallback<void>): void;
  create(contentLength: number, blobContentLength: number, options: Models.PageBlobCreateOptionalParams, callback: msRest.ServiceCallback<void>): void;
  create(contentLength: number, blobContentLength: number, options?: Models.PageBlobCreateOptionalParams, callback?: msRest.ServiceCallback<void>): Promise<Models.PageBlobCreateResponse> {
    return this.client.sendOperationRequest(
      {
        contentLength,
        blobContentLength,
        options
      },
      createOperationSpec,
      callback) as Promise<Models.PageBlobCreateResponse>;
  }

  /**
   * The Upload Pages operation writes a range of pages to a page blob
   *
   * @param {msRest.HttpRequestBody} body Initial data
   *
   * @param {number} contentLength The length of the request.
   *
   * @param {PageBlobUploadPagesOptionalParams} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse} The deserialized result object.
   *
   * @reject {Error|ServiceError} The error object.
   */
  uploadPages(body: msRest.HttpRequestBody, contentLength: number): Promise<Models.PageBlobUploadPagesResponse>;
  uploadPages(body: msRest.HttpRequestBody, contentLength: number, options: Models.PageBlobUploadPagesOptionalParams): Promise<Models.PageBlobUploadPagesResponse>;
  uploadPages(body: msRest.HttpRequestBody, contentLength: number, callback: msRest.ServiceCallback<void>): void;
  uploadPages(body: msRest.HttpRequestBody, contentLength: number, options: Models.PageBlobUploadPagesOptionalParams, callback: msRest.ServiceCallback<void>): void;
  uploadPages(body: msRest.HttpRequestBody, contentLength: number, options?: Models.PageBlobUploadPagesOptionalParams, callback?: msRest.ServiceCallback<void>): Promise<Models.PageBlobUploadPagesResponse> {
    return this.client.sendOperationRequest(
      {
        body,
        contentLength,
        options
      },
      uploadPagesOperationSpec,
      callback) as Promise<Models.PageBlobUploadPagesResponse>;
  }

  /**
   * The Clear Pages operation clears a set of pages from a page blob
   *
   * @param {number} contentLength The length of the request.
   *
   * @param {PageBlobClearPagesOptionalParams} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse} The deserialized result object.
   *
   * @reject {Error|ServiceError} The error object.
   */
  clearPages(contentLength: number): Promise<Models.PageBlobClearPagesResponse>;
  clearPages(contentLength: number, options: Models.PageBlobClearPagesOptionalParams): Promise<Models.PageBlobClearPagesResponse>;
  clearPages(contentLength: number, callback: msRest.ServiceCallback<void>): void;
  clearPages(contentLength: number, options: Models.PageBlobClearPagesOptionalParams, callback: msRest.ServiceCallback<void>): void;
  clearPages(contentLength: number, options?: Models.PageBlobClearPagesOptionalParams, callback?: msRest.ServiceCallback<void>): Promise<Models.PageBlobClearPagesResponse> {
    return this.client.sendOperationRequest(
      {
        contentLength,
        options
      },
      clearPagesOperationSpec,
      callback) as Promise<Models.PageBlobClearPagesResponse>;
  }

  /**
   * The Get Page Ranges operation returns the list of valid page ranges for a page blob or snapshot
   * of a page blob
   *
   * @param {PageBlobGetPageRangesOptionalParams} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse} The deserialized result object.
   *
   * @reject {Error|ServiceError} The error object.
   */
  getPageRanges(): Promise<Models.PageBlobGetPageRangesResponse>;
  getPageRanges(options: Models.PageBlobGetPageRangesOptionalParams): Promise<Models.PageBlobGetPageRangesResponse>;
  getPageRanges(callback: msRest.ServiceCallback<Models.PageList>): void;
  getPageRanges(options: Models.PageBlobGetPageRangesOptionalParams, callback: msRest.ServiceCallback<Models.PageList>): void;
  getPageRanges(options?: Models.PageBlobGetPageRangesOptionalParams, callback?: msRest.ServiceCallback<Models.PageList>): Promise<Models.PageBlobGetPageRangesResponse> {
    return this.client.sendOperationRequest(
      {
        options
      },
      getPageRangesOperationSpec,
      callback) as Promise<Models.PageBlobGetPageRangesResponse>;
  }

  /**
   * [Update] The Get Page Ranges Diff operation returns the list of valid page ranges for a page
   * blob that were changed between target blob and previous snapshot.
   *
   * @param {PageBlobGetPageRangesDiffOptionalParams} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse} The deserialized result object.
   *
   * @reject {Error|ServiceError} The error object.
   */
  getPageRangesDiff(): Promise<Models.PageBlobGetPageRangesDiffResponse>;
  getPageRangesDiff(options: Models.PageBlobGetPageRangesDiffOptionalParams): Promise<Models.PageBlobGetPageRangesDiffResponse>;
  getPageRangesDiff(callback: msRest.ServiceCallback<Models.PageList>): void;
  getPageRangesDiff(options: Models.PageBlobGetPageRangesDiffOptionalParams, callback: msRest.ServiceCallback<Models.PageList>): void;
  getPageRangesDiff(options?: Models.PageBlobGetPageRangesDiffOptionalParams, callback?: msRest.ServiceCallback<Models.PageList>): Promise<Models.PageBlobGetPageRangesDiffResponse> {
    return this.client.sendOperationRequest(
      {
        options
      },
      getPageRangesDiffOperationSpec,
      callback) as Promise<Models.PageBlobGetPageRangesDiffResponse>;
  }

  /**
   * Resize the Blob
   *
   * @param {number} blobContentLength This header specifies the maximum size for the page blob, up
   * to 1 TB. The page blob size must be aligned to a 512-byte boundary.
   *
   * @param {PageBlobResizeOptionalParams} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse} The deserialized result object.
   *
   * @reject {Error|ServiceError} The error object.
   */
  resize(blobContentLength: number): Promise<Models.PageBlobResizeResponse>;
  resize(blobContentLength: number, options: Models.PageBlobResizeOptionalParams): Promise<Models.PageBlobResizeResponse>;
  resize(blobContentLength: number, callback: msRest.ServiceCallback<void>): void;
  resize(blobContentLength: number, options: Models.PageBlobResizeOptionalParams, callback: msRest.ServiceCallback<void>): void;
  resize(blobContentLength: number, options?: Models.PageBlobResizeOptionalParams, callback?: msRest.ServiceCallback<void>): Promise<Models.PageBlobResizeResponse> {
    return this.client.sendOperationRequest(
      {
        blobContentLength,
        options
      },
      resizeOperationSpec,
      callback) as Promise<Models.PageBlobResizeResponse>;
  }

  /**
   * Update the sequence number of the blob
   *
   * @param {SequenceNumberActionType} sequenceNumberAction Required if the x-ms-blob-sequence-number
   * header is set for the request. This property applies to page blobs only. This property indicates
   * how the service should modify the blob's sequence number. Possible values include: 'max',
   * 'update', 'increment'
   *
   * @param {PageBlobUpdateSequenceNumberOptionalParams} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse} The deserialized result object.
   *
   * @reject {Error|ServiceError} The error object.
   */
  updateSequenceNumber(sequenceNumberAction: Models.SequenceNumberActionType): Promise<Models.PageBlobUpdateSequenceNumberResponse>;
  updateSequenceNumber(sequenceNumberAction: Models.SequenceNumberActionType, options: Models.PageBlobUpdateSequenceNumberOptionalParams): Promise<Models.PageBlobUpdateSequenceNumberResponse>;
  updateSequenceNumber(sequenceNumberAction: Models.SequenceNumberActionType, callback: msRest.ServiceCallback<void>): void;
  updateSequenceNumber(sequenceNumberAction: Models.SequenceNumberActionType, options: Models.PageBlobUpdateSequenceNumberOptionalParams, callback: msRest.ServiceCallback<void>): void;
  updateSequenceNumber(sequenceNumberAction: Models.SequenceNumberActionType, options?: Models.PageBlobUpdateSequenceNumberOptionalParams, callback?: msRest.ServiceCallback<void>): Promise<Models.PageBlobUpdateSequenceNumberResponse> {
    return this.client.sendOperationRequest(
      {
        sequenceNumberAction,
        options
      },
      updateSequenceNumberOperationSpec,
      callback) as Promise<Models.PageBlobUpdateSequenceNumberResponse>;
  }

  /**
   * The Copy Incremental operation copies a snapshot of the source page blob to a destination page
   * blob. The snapshot is copied such that only the differential changes between the previously
   * copied snapshot are transferred to the destination. The copied snapshots are complete copies of
   * the original snapshot and can be read or copied from as usual. This API is supported since REST
   * version 2016-05-31.
   *
   * @param {string} copySource Specifies the name of the source page blob snapshot. This value is a
   * URL of up to 2 KB in length that specifies a page blob snapshot. The value should be URL-encoded
   * as it would appear in a request URI. The source blob must either be public or must be
   * authenticated via a shared access signature.
   *
   * @param {PageBlobCopyIncrementalOptionalParams} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse} The deserialized result object.
   *
   * @reject {Error|ServiceError} The error object.
   */
  copyIncremental(copySource: string): Promise<Models.PageBlobCopyIncrementalResponse>;
  copyIncremental(copySource: string, options: Models.PageBlobCopyIncrementalOptionalParams): Promise<Models.PageBlobCopyIncrementalResponse>;
  copyIncremental(copySource: string, callback: msRest.ServiceCallback<void>): void;
  copyIncremental(copySource: string, options: Models.PageBlobCopyIncrementalOptionalParams, callback: msRest.ServiceCallback<void>): void;
  copyIncremental(copySource: string, options?: Models.PageBlobCopyIncrementalOptionalParams, callback?: msRest.ServiceCallback<void>): Promise<Models.PageBlobCopyIncrementalResponse> {
    return this.client.sendOperationRequest(
      {
        copySource,
        options
      },
      copyIncrementalOperationSpec,
      callback) as Promise<Models.PageBlobCopyIncrementalResponse>;
  }

}

// Operation Specifications
const serializer = new msRest.Serializer(Mappers, true);
const createOperationSpec: msRest.OperationSpec = {
  httpMethod: "PUT",
  path: "{containerName}/{blob}",
  urlParameters: [
    Parameters.url
  ],
  queryParameters: [
    Parameters.timeout
  ],
  headerParameters: [
    Parameters.contentLength,
    Parameters.metadata,
    Parameters.blobContentLength,
    Parameters.blobSequenceNumber,
    Parameters.version,
    Parameters.requestId,
    Parameters.blobType0,
    Parameters.blobContentType,
    Parameters.blobContentEncoding,
    Parameters.blobContentLanguage,
    Parameters.blobContentMD5,
    Parameters.blobCacheControl,
    Parameters.blobContentDisposition,
    Parameters.leaseId0,
    Parameters.ifModifiedSince,
    Parameters.ifUnmodifiedSince,
    Parameters.ifMatch,
    Parameters.ifNoneMatch
  ],
  responses: {
    201: {
      headersMapper: Mappers.PageBlobCreateHeaders
    },
    default: {
      bodyMapper: Mappers.StorageError
    }
  },
  isXML: true,
  serializer
};

const uploadPagesOperationSpec: msRest.OperationSpec = {
  httpMethod: "PUT",
  path: "{containerName}/{blob}",
  urlParameters: [
    Parameters.url
  ],
  queryParameters: [
    Parameters.timeout,
    Parameters.comp10
  ],
  headerParameters: [
    Parameters.contentLength,
    Parameters.transactionalContentMD5,
    Parameters.range,
    Parameters.version,
    Parameters.requestId,
    Parameters.pageWrite0,
    Parameters.leaseId0,
    Parameters.ifSequenceNumberLessThanOrEqualTo,
    Parameters.ifSequenceNumberLessThan,
    Parameters.ifSequenceNumberEqualTo,
    Parameters.ifModifiedSince,
    Parameters.ifUnmodifiedSince,
    Parameters.ifMatch,
    Parameters.ifNoneMatch
  ],
  requestBody: {
    parameterPath: "body",
    mapper: {
      required: true,
      serializedName: "body",
      type: {
        name: "Stream"
      }
    }
  },
  contentType: "application/octet-stream",
  responses: {
    201: {
      headersMapper: Mappers.PageBlobUploadPagesHeaders
    },
    default: {
      bodyMapper: Mappers.StorageError
    }
  },
  isXML: true,
  serializer
};

const clearPagesOperationSpec: msRest.OperationSpec = {
  httpMethod: "PUT",
  path: "{containerName}/{blob}",
  urlParameters: [
    Parameters.url
  ],
  queryParameters: [
    Parameters.timeout,
    Parameters.comp10
  ],
  headerParameters: [
    Parameters.contentLength,
    Parameters.range,
    Parameters.version,
    Parameters.requestId,
    Parameters.pageWrite1,
    Parameters.leaseId0,
    Parameters.ifSequenceNumberLessThanOrEqualTo,
    Parameters.ifSequenceNumberLessThan,
    Parameters.ifSequenceNumberEqualTo,
    Parameters.ifModifiedSince,
    Parameters.ifUnmodifiedSince,
    Parameters.ifMatch,
    Parameters.ifNoneMatch
  ],
  responses: {
    201: {
      headersMapper: Mappers.PageBlobClearPagesHeaders
    },
    default: {
      bodyMapper: Mappers.StorageError
    }
  },
  isXML: true,
  serializer
};

const getPageRangesOperationSpec: msRest.OperationSpec = {
  httpMethod: "GET",
  path: "{containerName}/{blob}",
  urlParameters: [
    Parameters.url
  ],
  queryParameters: [
    Parameters.snapshot,
    Parameters.timeout,
    Parameters.comp11
  ],
  headerParameters: [
    Parameters.range,
    Parameters.version,
    Parameters.requestId,
    Parameters.leaseId0,
    Parameters.ifModifiedSince,
    Parameters.ifUnmodifiedSince,
    Parameters.ifMatch,
    Parameters.ifNoneMatch
  ],
  responses: {
    200: {
      bodyMapper: Mappers.PageList,
      headersMapper: Mappers.PageBlobGetPageRangesHeaders
    },
    default: {
      bodyMapper: Mappers.StorageError
    }
  },
  isXML: true,
  serializer
};

const getPageRangesDiffOperationSpec: msRest.OperationSpec = {
  httpMethod: "GET",
  path: "{containerName}/{blob}",
  urlParameters: [
    Parameters.url
  ],
  queryParameters: [
    Parameters.snapshot,
    Parameters.timeout,
    Parameters.prevsnapshot,
    Parameters.comp11
  ],
  headerParameters: [
    Parameters.range,
    Parameters.version,
    Parameters.requestId,
    Parameters.leaseId0,
    Parameters.ifModifiedSince,
    Parameters.ifUnmodifiedSince,
    Parameters.ifMatch,
    Parameters.ifNoneMatch
  ],
  responses: {
    200: {
      bodyMapper: Mappers.PageList,
      headersMapper: Mappers.PageBlobGetPageRangesDiffHeaders
    },
    default: {
      bodyMapper: Mappers.StorageError
    }
  },
  isXML: true,
  serializer
};

const resizeOperationSpec: msRest.OperationSpec = {
  httpMethod: "PUT",
  path: "{containerName}/{blob}",
  urlParameters: [
    Parameters.url
  ],
  queryParameters: [
    Parameters.timeout,
    Parameters.comp0
  ],
  headerParameters: [
    Parameters.blobContentLength,
    Parameters.version,
    Parameters.requestId,
    Parameters.leaseId0,
    Parameters.ifModifiedSince,
    Parameters.ifUnmodifiedSince,
    Parameters.ifMatch,
    Parameters.ifNoneMatch
  ],
  responses: {
    200: {
      headersMapper: Mappers.PageBlobResizeHeaders
    },
    default: {
      bodyMapper: Mappers.StorageError
    }
  },
  isXML: true,
  serializer
};

const updateSequenceNumberOperationSpec: msRest.OperationSpec = {
  httpMethod: "PUT",
  path: "{containerName}/{blob}",
  urlParameters: [
    Parameters.url
  ],
  queryParameters: [
    Parameters.timeout,
    Parameters.comp0
  ],
  headerParameters: [
    Parameters.sequenceNumberAction,
    Parameters.blobSequenceNumber,
    Parameters.version,
    Parameters.requestId,
    Parameters.leaseId0,
    Parameters.ifModifiedSince,
    Parameters.ifUnmodifiedSince,
    Parameters.ifMatch,
    Parameters.ifNoneMatch
  ],
  responses: {
    200: {
      headersMapper: Mappers.PageBlobUpdateSequenceNumberHeaders
    },
    default: {
      bodyMapper: Mappers.StorageError
    }
  },
  isXML: true,
  serializer
};

const copyIncrementalOperationSpec: msRest.OperationSpec = {
  httpMethod: "PUT",
  path: "{containerName}/{blob}",
  urlParameters: [
    Parameters.url
  ],
  queryParameters: [
    Parameters.timeout,
    Parameters.comp12
  ],
  headerParameters: [
    Parameters.copySource,
    Parameters.version,
    Parameters.requestId,
    Parameters.ifModifiedSince,
    Parameters.ifUnmodifiedSince,
    Parameters.ifMatch,
    Parameters.ifNoneMatch
  ],
  responses: {
    202: {
      headersMapper: Mappers.PageBlobCopyIncrementalHeaders
    },
    default: {
      bodyMapper: Mappers.StorageError
    }
  },
  isXML: true,
  serializer
};