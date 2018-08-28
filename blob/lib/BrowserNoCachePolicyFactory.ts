import {
  RequestPolicy,
  RequestPolicyFactory,
  RequestPolicyOptions
} from "ms-rest-js";
import { BrowserNoCachePolicy } from "./policies/BrowserNoCachePolicy";

/**
 * BrowserNoCachePolicyFactory is a factory class helping generating BrowserNoCachePolicy objects.
 *
 * @export
 * @class BrowserNoCachePolicyFactory
 * @implements {RequestPolicyFactory}
 */
export class BrowserNoCachePolicyFactory implements RequestPolicyFactory {
  public create(
    nextPolicy: RequestPolicy,
    options: RequestPolicyOptions
  ): BrowserNoCachePolicy {
    return new BrowserNoCachePolicy(nextPolicy, options);
  }
}
