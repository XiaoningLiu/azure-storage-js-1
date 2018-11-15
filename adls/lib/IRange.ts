// tslint:disable:max-line-length
/**
 * Range for Blob Service Operations.
 * @see https://docs.microsoft.com/en-us/rest/api/storageservices/specifying-the-range-header-for-blob-service-operations
 *
 * @export
 * @interface IRange
 */
export interface IRange {
  /**
   * StartByte, larger than or equal 0.
   *
   * @type {string}
   * @memberof IRange
   */
  offset: number;
  /**
   * Optional. Count of bytes, larger than 0.
   * If not provided, will return bytes from offset to the end.
   *
   * @type {string}
   * @memberof IRange
   */
  count?: number;
}

/**
 * Generate a range string. For example:
 *
 * "bytes=255-" or "bytes=0-511"
 *
 * @export
 * @param {IRange} range
 * @returns {string}
 */
export function rangeToString(range: IRange): string {
  if (range.offset < 0) {
    throw new RangeError(`IRange.offset cannot be smaller than 0.`);
  }
  if (range.count && range.count <= 0) {
    throw new RangeError(
      `IRange.count must be larger than 0. Leave it undefined if you want a range from offset to the end.`
    );
  }
  return range.count
    ? `bytes=${range.offset}-${range.offset + range.count - 1}`
    : `bytes=${range.offset}-`;
}

/**
 * Generate a IRange object from a range string. For example:
 *
 * "bytes=255-" will return { offset: 255 }
 *
 * "bytes=0-511" will return { offset: 0, count: 512 }
 *
 * @export
 * @param {string} range
 * @returns {IRange}
 */
export function stringToRange(range: string): IRange {
  if (!range.startsWith("bytes=")) {
    throw new RangeError(
      `Invalid range string, ${range} doesn't start with bytes=`
    );
  }

  const startAndEnd = range.substr(6).split("-");
  const offset = Number.parseInt(startAndEnd[0]);
  const end =
    startAndEnd.length > 1 ? Number.parseInt(startAndEnd[1]) : undefined;

  return {
    count: end ? end - offset + 1 : undefined,
    offset
  };
}
