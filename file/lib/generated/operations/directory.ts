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
import * as Mappers from "../models/directoryMappers";
import * as Parameters from "../models/parameters";
import { StorageClientContext } from "../storageClientContext";

/** Class representing a Directory. */
export class Directory {
  private readonly client: StorageClientContext;

  /**
   * Create a Directory.
   * @param {StorageClientContext} client Reference to the service client.
   */
  constructor(client: StorageClientContext) {
    this.client = client;
  }

  /**
   * Creates a new directory under the specified share or parent directory.
   *
   * @param {DirectoryCreateOptionalParams} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse} The deserialized result object.
   *
   * @reject {Error|ServiceError} The error object.
   */
  create(): Promise<Models.DirectoryCreateResponse>;
  create(options: Models.DirectoryCreateOptionalParams): Promise<Models.DirectoryCreateResponse>;
  create(callback: msRest.ServiceCallback<void>): void;
  create(options: Models.DirectoryCreateOptionalParams, callback: msRest.ServiceCallback<void>): void;
  create(options?: Models.DirectoryCreateOptionalParams, callback?: msRest.ServiceCallback<void>): Promise<Models.DirectoryCreateResponse> {
    return this.client.sendOperationRequest(
      {
        options
      },
      createOperationSpec,
      callback) as Promise<Models.DirectoryCreateResponse>;
  }

  /**
   * Returns all system properties for the specified directory, and can also be used to check the
   * existence of a directory. The data returned does not include the files in the directory or any
   * subdirectories.
   *
   * @param {DirectoryGetPropertiesOptionalParams} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse} The deserialized result object.
   *
   * @reject {Error|ServiceError} The error object.
   */
  getProperties(): Promise<Models.DirectoryGetPropertiesResponse>;
  getProperties(options: Models.DirectoryGetPropertiesOptionalParams): Promise<Models.DirectoryGetPropertiesResponse>;
  getProperties(callback: msRest.ServiceCallback<void>): void;
  getProperties(options: Models.DirectoryGetPropertiesOptionalParams, callback: msRest.ServiceCallback<void>): void;
  getProperties(options?: Models.DirectoryGetPropertiesOptionalParams, callback?: msRest.ServiceCallback<void>): Promise<Models.DirectoryGetPropertiesResponse> {
    return this.client.sendOperationRequest(
      {
        options
      },
      getPropertiesOperationSpec,
      callback) as Promise<Models.DirectoryGetPropertiesResponse>;
  }

  /**
   * Removes the specified empty directory. Note that the directory must be empty before it can be
   * deleted.
   *
   * @param {DirectoryDeleteMethodOptionalParams} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse} The deserialized result object.
   *
   * @reject {Error|ServiceError} The error object.
   */
  deleteMethod(): Promise<Models.DirectoryDeleteResponse>;
  deleteMethod(options: Models.DirectoryDeleteMethodOptionalParams): Promise<Models.DirectoryDeleteResponse>;
  deleteMethod(callback: msRest.ServiceCallback<void>): void;
  deleteMethod(options: Models.DirectoryDeleteMethodOptionalParams, callback: msRest.ServiceCallback<void>): void;
  deleteMethod(options?: Models.DirectoryDeleteMethodOptionalParams, callback?: msRest.ServiceCallback<void>): Promise<Models.DirectoryDeleteResponse> {
    return this.client.sendOperationRequest(
      {
        options
      },
      deleteMethodOperationSpec,
      callback) as Promise<Models.DirectoryDeleteResponse>;
  }

  /**
   * Updates user defined metadata for the specified directory.
   *
   * @param {DirectorySetMetadataOptionalParams} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse} The deserialized result object.
   *
   * @reject {Error|ServiceError} The error object.
   */
  setMetadata(): Promise<Models.DirectorySetMetadataResponse>;
  setMetadata(options: Models.DirectorySetMetadataOptionalParams): Promise<Models.DirectorySetMetadataResponse>;
  setMetadata(callback: msRest.ServiceCallback<void>): void;
  setMetadata(options: Models.DirectorySetMetadataOptionalParams, callback: msRest.ServiceCallback<void>): void;
  setMetadata(options?: Models.DirectorySetMetadataOptionalParams, callback?: msRest.ServiceCallback<void>): Promise<Models.DirectorySetMetadataResponse> {
    return this.client.sendOperationRequest(
      {
        options
      },
      setMetadataOperationSpec,
      callback) as Promise<Models.DirectorySetMetadataResponse>;
  }

  /**
   * Returns a list of files or directories under the specified share or directory. It lists the
   * contents only for a single level of the directory hierarchy.
   *
   * @param {DirectoryListFilesAndDirectoriesSegmentOptionalParams} [options] Optional Parameters.
   *
   * @returns {Promise} A promise is returned
   *
   * @resolve {HttpOperationResponse} The deserialized result object.
   *
   * @reject {Error|ServiceError} The error object.
   */
  listFilesAndDirectoriesSegment(): Promise<Models.DirectoryListFilesAndDirectoriesSegmentResponse>;
  listFilesAndDirectoriesSegment(options: Models.DirectoryListFilesAndDirectoriesSegmentOptionalParams): Promise<Models.DirectoryListFilesAndDirectoriesSegmentResponse>;
  listFilesAndDirectoriesSegment(callback: msRest.ServiceCallback<Models.ListFilesAndDirectoriesSegmentResponse>): void;
  listFilesAndDirectoriesSegment(options: Models.DirectoryListFilesAndDirectoriesSegmentOptionalParams, callback: msRest.ServiceCallback<Models.ListFilesAndDirectoriesSegmentResponse>): void;
  listFilesAndDirectoriesSegment(options?: Models.DirectoryListFilesAndDirectoriesSegmentOptionalParams, callback?: msRest.ServiceCallback<Models.ListFilesAndDirectoriesSegmentResponse>): Promise<Models.DirectoryListFilesAndDirectoriesSegmentResponse> {
    return this.client.sendOperationRequest(
      {
        options
      },
      listFilesAndDirectoriesSegmentOperationSpec,
      callback) as Promise<Models.DirectoryListFilesAndDirectoriesSegmentResponse>;
  }

}

// Operation Specifications
const serializer = new msRest.Serializer(Mappers, true);
const createOperationSpec: msRest.OperationSpec = {
  httpMethod: "PUT",
  path: "{shareName}/{directory}",
  urlParameters: [
    Parameters.url
  ],
  queryParameters: [
    Parameters.timeout,
    Parameters.restype2
  ],
  headerParameters: [
    Parameters.metadata,
    Parameters.version
  ],
  responses: {
    201: {
      headersMapper: Mappers.DirectoryCreateHeaders
    },
    default: {
      bodyMapper: Mappers.StorageError
    }
  },
  isXML: true,
  serializer
};

const getPropertiesOperationSpec: msRest.OperationSpec = {
  httpMethod: "GET",
  path: "{shareName}/{directory}",
  urlParameters: [
    Parameters.url
  ],
  queryParameters: [
    Parameters.sharesnapshot,
    Parameters.timeout,
    Parameters.restype2
  ],
  headerParameters: [
    Parameters.version
  ],
  responses: {
    200: {
      headersMapper: Mappers.DirectoryGetPropertiesHeaders
    },
    default: {
      bodyMapper: Mappers.StorageError
    }
  },
  isXML: true,
  serializer
};

const deleteMethodOperationSpec: msRest.OperationSpec = {
  httpMethod: "DELETE",
  path: "{shareName}/{directory}",
  urlParameters: [
    Parameters.url
  ],
  queryParameters: [
    Parameters.timeout,
    Parameters.restype2
  ],
  headerParameters: [
    Parameters.version
  ],
  responses: {
    202: {
      headersMapper: Mappers.DirectoryDeleteHeaders
    },
    default: {
      bodyMapper: Mappers.StorageError
    }
  },
  isXML: true,
  serializer
};

const setMetadataOperationSpec: msRest.OperationSpec = {
  httpMethod: "PUT",
  path: "{shareName}/{directory}",
  urlParameters: [
    Parameters.url
  ],
  queryParameters: [
    Parameters.timeout,
    Parameters.restype2,
    Parameters.comp3
  ],
  headerParameters: [
    Parameters.metadata,
    Parameters.version
  ],
  responses: {
    202: {
      headersMapper: Mappers.DirectorySetMetadataHeaders
    },
    default: {
      bodyMapper: Mappers.StorageError
    }
  },
  isXML: true,
  serializer
};

const listFilesAndDirectoriesSegmentOperationSpec: msRest.OperationSpec = {
  httpMethod: "GET",
  path: "{shareName}/{directory}",
  urlParameters: [
    Parameters.url
  ],
  queryParameters: [
    Parameters.prefix,
    Parameters.sharesnapshot,
    Parameters.marker,
    Parameters.maxresults,
    Parameters.timeout,
    Parameters.restype2,
    Parameters.comp1
  ],
  headerParameters: [
    Parameters.version
  ],
  responses: {
    200: {
      bodyMapper: Mappers.ListFilesAndDirectoriesSegmentResponse,
      headersMapper: Mappers.DirectoryListFilesAndDirectoriesSegmentHeaders
    },
    default: {
      bodyMapper: Mappers.StorageError
    }
  },
  isXML: true,
  serializer
};
