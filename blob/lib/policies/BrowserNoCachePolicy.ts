import {
  BaseRequestPolicy,
  HttpOperationResponse,
  isNode,
  RequestPolicy,
  RequestPolicyOptions,
  WebResource
} from "ms-rest-js";
import { setURLParameter } from "../utils/utils.common";

/**
 * Browsers cache GET/HEAD requests by adding conditional headers such as 'IF_MODIFIED_SINCE'
 * BrowserNoCachePolicy is a policy used to add a timestamp query to GET/HEAD request URL
 * thus avoid the browser cache.
 *
 * @class BrowserNoCachePolicy
 * @extends {BaseRequestPolicy}
 */
export class BrowserNoCachePolicy extends BaseRequestPolicy {
  /**
   * Creates an instance of BrowserNoCachePolicy.
   * @param {RequestPolicy} nextPolicy
   * @param {RequestPolicyOptions} options
   * @memberof BrowserNoCachePolicy
   */
  constructor(nextPolicy: RequestPolicy, options: RequestPolicyOptions) {
    super(nextPolicy, options);
  }

  /**
   * Sends out request.
   *
   * @param {WebResource} request
   * @returns {Promise<HttpOperationResponse>}
   * @memberof BrowserNoCachePolicy
   */
  public async sendRequest(
    request: WebResource
  ): Promise<HttpOperationResponse> {
    if (
      !isNode &&
      request &&
      (request.method.toUpperCase() === "GET" ||
        request.method.toUpperCase() === "HEAD")
    ) {
      request.url = setURLParameter(
        request.url,
        "_",
        new Date().getTime().toString()
      );
    }

    return this._nextPolicy.sendRequest(request);
  }
}
