import { HttpResponse, isNode, TransferProgressEvent } from "ms-rest-js";

import { Aborter } from "./Aborter";
import { PathReadHeaders, PathReadResponse as IPathReadResponse } from "./generated/lib/models";
import { ReadableStreamGetter, RetriableReadableStream } from "./utils/RetriableReadableStream";

/**
 * ONLY AVAILABLE IN NODE.JS RUNTIME.
 *
 * PathReadResponse implements IPathReadResponse interface, and in Node.js runtime it will
 * automatically retry when internal read stream unexpected ends. (This kind of unexpected ends cannot
 * trigger retries defined in pipeline retry policy.)
 *
 * The readableStreamBody stream will retry underlayer, you can just use it as a normal Node.js
 * Readable stream.
 *
 * @export
 * @class PathReadResponse
 * @implements {IPathReadResponse}
 */
export class PathReadResponse implements IPathReadResponse {
  public get acceptRanges(): string | undefined {
    return this.originalResponse.acceptRanges;
  }

  public get cacheControl(): string | undefined {
    return this.originalResponse.cacheControl;
  }

  public get contentDisposition(): string | undefined {
    return this.originalResponse.contentDisposition;
  }

  public get contentEncoding(): string | undefined {
    return this.originalResponse.contentEncoding;
  }

  public get contentLanguage(): string | undefined {
    return this.originalResponse.contentLanguage;
  }

  public get contentLength(): number | undefined {
    return this.originalResponse.contentLength;
  }

  public get contentRange(): string | undefined {
    return this.originalResponse.contentRange;
  }

  public get contentType(): string | undefined {
    return this.originalResponse.contentType;
  }

  public get date(): string | undefined {
    return this.originalResponse.date;
  }

  public get eTag(): string | undefined {
    return this.originalResponse.eTag;
  }

  public get lastModified(): string | undefined {
    return this.originalResponse.lastModified;
  }

  public get xMsRequestId(): string | undefined {
    return this.originalResponse.xMsRequestId;
  }

  public get xMsVersion(): string | undefined {
    return this.originalResponse.xMsVersion;
  }

  public get xMsResourceType(): string | undefined {
    return this.originalResponse.xMsResourceType;
  }

  public get xMsProperties(): string | undefined {
    return this.originalResponse.xMsProperties;
  }

  public get xMsLeaseDuration(): string | undefined {
    return this.originalResponse.xMsLeaseDuration;
  }

  public get xMsLeaseState(): string | undefined {
    return this.originalResponse.xMsLeaseState;
  }

  public get xMsLeaseStatus(): string | undefined {
    return this.originalResponse.xMsLeaseStatus;
  }

  public get blobBody(): Promise<Blob> | undefined {
    return this.originalResponse.blobBody;
  }

  public get readableStreamBody(): NodeJS.ReadableStream | undefined {
    return isNode ? this.pathReadStream : undefined;
  }

  public get _response(): HttpResponse & {
    parsedHeaders: PathReadHeaders;
  } {
    return this.originalResponse._response;
  }

  private originalResponse: IPathReadResponse;
  private pathReadStream?: RetriableReadableStream;

  public constructor(
    aborter: Aborter,
    originalResponse: IPathReadResponse,
    getter: ReadableStreamGetter,
    start: number,
    end: number,
    maxRetries?: number,
    progress?: (progress: TransferProgressEvent) => void
  ) {
    this.originalResponse = originalResponse;
    this.pathReadStream = new RetriableReadableStream(
      aborter,
      getter,
      this.originalResponse.readableStreamBody!,
      start,
      end,
      maxRetries,
      progress
    );
  }
}
