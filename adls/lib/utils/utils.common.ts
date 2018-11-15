import { isNode, URLBuilder } from "ms-rest-js";

/**
 * Append a string to URL path. Will remove duplicated "/" in front of the string
 * when URL path ends with a "/".
 *
 * @export
 * @param {string} url Source URL string
 * @param {string} name String to be appended to URL
 * @returns {string} An updated URL string
 */
export function appendToURLPath(url: string, name: string): string {
  const urlParsed = URLBuilder.parse(url);

  let path = urlParsed.getPath();
  path = path
    ? path.endsWith("/")
      ? `${path}${name}`
      : `${path}/${name}`
    : name;
  urlParsed.setPath(path);

  return urlParsed.toString();
}

/**
 * Set URL parameter name and value. If name exists in URL parameters, old value
 * will be replaced by name key. If not provide value, the parameter will be deleted.
 *
 * @export
 * @param {string} url Source URL string
 * @param {string} name Parameter name
 * @param {string} [value] Parameter value
 * @returns {string} An updated URL string
 */
export function setURLParameter(
  url: string,
  name: string,
  value?: string
): string {
  const urlParsed = URLBuilder.parse(url);
  urlParsed.setQueryParameter(name, value);
  return urlParsed.toString();
}

/**
 * Set URL path. If path exists in URL, old value
 * will be replaced. If not provide value, the old path will be deleted.
 *
 * @export
 * @param {string} url Source URL string
 * @param {string} [path] Path value
 * @returns {string} An updated URL string
 */
export function setURLPath(url: string, path?: string): string {
  const urlParsed = URLBuilder.parse(url);
  urlParsed.setPath(path);
  return urlParsed.toString();
}

/**
 * Get URL parameter by name.
 *
 * @export
 * @param {string} url
 * @param {string} name
 * @returns {(string | string[] | undefined)}
 */
export function getURLParameter(
  url: string,
  name: string
): string | string[] | undefined {
  const urlParsed = URLBuilder.parse(url);
  return urlParsed.getQueryParameterValue(name);
}

/**
 * Get base URI from a URL.
 *
 * For example, "https://example.com:8080/dir/path?p1=v1", will return
 * "https://example.com:8080"
 *
 * @export
 * @param {string} url
 * @returns {(string | undefined)}
 */
export function getURLBaseURI(url: string): string | undefined {
  const urlParsed = URLBuilder.parse(url);
  const urlScheme = urlParsed.getScheme();
  const urlHost = urlParsed.getHost();
  const urlPort = urlParsed.getPort();

  let baseURI = "";
  baseURI += urlScheme ? `${urlScheme}://` : "";
  baseURI += urlHost ? urlHost : "";
  baseURI += urlPort ? `:${urlPort}` : "";

  return baseURI.length > 0 ? baseURI : undefined;
}

/**
 * Get the storage account from an URL string.
 *
 * @export
 * @param {string} url Source URL string
 * @returns {(string | undefined)}
 */
export function getURLStorageAccount(url: string): string | undefined {
  const urlParsed = URLBuilder.parse(url);
  const host = urlParsed.getHost();

  if (host) {
    const keywords = host.split(".");
    if (keywords.length > 0) {
      return keywords[0];
    }
  }

  return undefined;
}

/**
 * Get the url path components from an URL string.
 *
 * - "https://myaccount.dfs.core.windows.net/myfilesystem/directory/file" returns ["myfilesystem", "directory", "file"]
 * - "https://myaccount.dfs.core.windows.net/myfilesystem/directory/" returns ["myfilesystem", "directory", ""]
 * - "https://myaccount.dfs.core.windows.net/myfilesystem/directory" returns ["myfilesystem", "directory"]
 * - "https://myaccount.dfs.core.windows.net/myfilesystem//" returns ["myfilesystem", "", ""]
 * - "https://myaccount.dfs.core.windows.net/myfilesystem/" returns ["myfilesystem", ""]
 * - "https://myaccount.dfs.core.windows.net/myfilesystem" returns ["myfilesystem"]
 * - "https://myaccount.dfs.core.windows.net/" returns [""]
 * - "https://myaccount.dfs.core.windows.net" returns []
 *
 *
 * @export
 * @param {string} url Source URL string
 * @returns {string[]}
 */
export function getURLPathComponents(url: string): string[] {
  const urlPath = getURLPath(url);
  if (!urlPath) {
    return [];
  }

  return urlPath.split("/").slice(1);
}

/**
 * Get the filesystem name from an URL.
 *
 * - "https://myaccount.dfs.core.windows.net/myfilesystem/directory/file" returns "myfilesystem"
 * - "https://myaccount.dfs.core.windows.net/myfilesystem/directory/" returns "myfilesystem"
 * - "https://myaccount.dfs.core.windows.net/myfilesystem/directory" returns "myfilesystem"
 * - "https://myaccount.dfs.core.windows.net/myfilesystem//" returns "myfilesystem"
 * - "https://myaccount.dfs.core.windows.net/myfilesystem/" returns "myfilesystem"
 * - "https://myaccount.dfs.core.windows.net/myfilesystem" returns "myfilesystem"
 * - "https://myaccount.dfs.core.windows.net/" throws RangeError(`Invalid url "${url}", file system is undefined.`)
 * - "https://myaccount.dfs.core.windows.net" throws RangeError(`Invalid url "${url}", file system is undefined.`)
 *
 * @export
 * @param {string} url
 * @returns {string}
 */
export function getFileSystemFromURL(url: string): string {
  const pathComponents = getURLPathComponents(url);
  if (pathComponents.length > 0 && pathComponents[0].length > 0) {
    return pathComponents[0];
  }

  throw new RangeError(`Invalid url "${url}", file system is undefined.`);
}

/**
 * Get the ADLSv2 path from an URL. Must be a valid ADLSv2 path URL with filesystem.
 *
 * - "https://myaccount.dfs.core.windows.net/myfilesystem/directory/file" returns "directory/file"
 * - "https://myaccount.dfs.core.windows.net/myfilesystem/directory/" returns "directory/"
 * - "https://myaccount.dfs.core.windows.net/myfilesystem/directory" returns "directory"
 * - "https://myaccount.dfs.core.windows.net/myfilesystem//" returns "/"
 * - "https://myaccount.dfs.core.windows.net/myfilesystem/" returns "" // root directory
 * - "https://myaccount.dfs.core.windows.net/myfilesystem" returns "" // root directory
 * - "https://myaccount.dfs.core.windows.net/" throws RangeError(`Invalid url "${url}", file system is undefined.`)
 * - "https://myaccount.dfs.core.windows.net" throws RangeError(`Invalid url "${url}", file system is undefined.`)
 *
 * @export
 * @param {string} url
 * @returns {string}
 */
export function getADLSv2PathFromURL(url: string): string {
  // Valid filesystem
  getFileSystemFromURL(url);

  const pathComponents = getURLPathComponents(url);
  return pathComponents.slice(1).join("/");
}

/**
 * Set URL host.
 *
 * @export
 * @param {string} url Source URL string
 * @param {string} host New host string
 * @returns An updated URL string
 */
export function setURLHost(url: string, host: string): string {
  const urlParsed = URLBuilder.parse(url);
  urlParsed.setHost(host);
  return urlParsed.toString();
}

/**
 * Get URL path from an URL string.
 *
 * @export
 * @param {string} url Source URL string
 * @returns {(string | undefined)}
 */
export function getURLPath(url: string): string | undefined {
  const urlParsed = URLBuilder.parse(url);
  return urlParsed.getPath();
}

/**
 * Get URL query key value pairs from an URL string.
 *
 * @export
 * @param {string} url
 * @returns {{[key: string]: string}}
 */
export function getURLQueries(url: string): { [key: string]: string } {
  let queryString = URLBuilder.parse(url).getQuery();
  if (!queryString) {
    return {};
  }

  queryString = queryString.trim();
  queryString = queryString.startsWith("?")
    ? queryString.substr(1)
    : queryString;

  let querySubStrings: string[] = queryString.split("&");
  querySubStrings = querySubStrings.filter((value: string) => {
    const indexOfEqual = value.indexOf("=");
    const lastIndexOfEqual = value.lastIndexOf("=");
    return (
      indexOfEqual > 0 &&
      indexOfEqual === lastIndexOfEqual &&
      lastIndexOfEqual < value.length - 1
    );
  });

  const queries: { [key: string]: string } = {};
  for (const querySubString of querySubStrings) {
    const splitResults = querySubString.split("=");
    const key: string = splitResults[0];
    const value: string = splitResults[1];
    queries[key] = value;
  }

  return queries;
}

/**
 * Rounds a date off to seconds.
 *
 * @export
 * @param {Date} date Input date
 * @returns {string} Date string in ISO8061 format, with no milliseconds component
 */
export function truncatedISO8061Date(date: Date): string {
  const dateString = date.toISOString();
  return dateString.substring(0, dateString.length - 1) + "0000" + "Z";
}

/**
 * Base64 encode.
 *
 * @export
 * @param {string} content
 * @returns {string}
 */
export function base64encode(content: string): string {
  return !isNode ? btoa(content) : Buffer.from(content).toString("base64");
}

/**
 * Base64 decode.
 *
 * @export
 * @param {string} encodedString
 * @returns {string}
 */
export function base64decode(encodedString: string): string {
  return !isNode
    ? atob(encodedString)
    : Buffer.from(encodedString, "base64").toString();
}

/**
 * Generate a 64 bytes base64 block ID string.
 *
 * @export
 * @param {number} blockIndex
 * @returns {string}
 */
export function generateBlockID(
  blockIDPrefix: string,
  blockIndex: number
): string {
  // To generate a 64 bytes base64 string, source string should be 48
  const maxSourceStringLength = 48;

  // A blob can have a maximum of 100,000 uncommitted blocks at any given time
  const maxBlockIndexLength = 6;

  const maxAllowedBlockIDPrefixLength =
    maxSourceStringLength - maxBlockIndexLength;

  if (blockIDPrefix.length > maxAllowedBlockIDPrefixLength) {
    blockIDPrefix = blockIDPrefix.slice(0, maxAllowedBlockIDPrefixLength);
  }
  const res =
    blockIDPrefix +
    padStart(
      blockIndex.toString(),
      maxSourceStringLength - blockIDPrefix.length,
      "0"
    );
  return base64encode(res);
}

/**
 * String.prototype.padStart()
 *
 * @export
 * @param {string} currentString
 * @param {number} targetLength
 * @param {string} [padString=" "]
 * @returns {string}
 */
export function padStart(
  currentString: string,
  targetLength: number,
  padString: string = " "
): string {
  if (String.prototype.padStart) {
    return currentString.padStart(targetLength, padString);
  }

  padString = padString || " ";
  if (currentString.length > targetLength) {
    return currentString;
  } else {
    targetLength = targetLength - currentString.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length);
    }
    return padString.slice(0, targetLength) + currentString;
  }
}
