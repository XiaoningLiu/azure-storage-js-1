# Changelog

2019.03 Version 12.1.1-preview

* Fixed an issue that [ and ] cannot be properly encoded when they are included in URLs.

2019.01 Version 12.1.0-preview

* Added support for $ started filesystems.
* Added support for `close` parameter for `PathUpdate` options.

2018.11 Version 12.0.0-preview

* Updated API version to 2018-11-09.
  * Added support for upn setting. Supported methods are `FileSystemURL.listPathsSegment()`, `PathURL.getProperties()`.
  * `ConentLength` in response object now is `number` instead of `string`.
  * Added `xMsLeaseId` parameter for `PathURL.read()`, `PathURL.getProperties()` methods.
  * [Breaking] Removed `xMsProposedLeaseId` parameter for `PathCreate` operation.
  * [Breaking] Removed `xMsLeaseAction` parameter for `PathUpdate` operation.
* Fixed `PathURL.read()` bug when downloading stream retries.
* Allowed create a `PathURL` to root directory like "http://account.dfs.core.windows.net/filesystem//".
* Fixed a `stringToRange` bug.
* Removed cookie header when using `TokenCredential`.

2018.11 Version 11.1.1-preview

* Exported RequestPolicyFactory, RequestPolicy and RequestPolicyOptions

2018.10 Version 11.1.0-preview

* Added `uploadLocalFile` global method in `highlevel.node.ts` to support parallel uploading
* `PathURL.read` returns a response with a RetriableReadableStream, which will retry when original download stream unexpected ends.
* [Breaking] `continuation` becomes top1 layer parameters in `listFileSystemsSegment`
* [Breaking] `contentLength` parameter for `PathURL.update` is `number` type now, previous is `string`

2018.10 Version 11.0.0-preview

* Initial Private Release. API version 2018-06-17 supported. Please see the README for information on the new design.
