# Changelog

2018.11 Version 11.1.1-preview

* Exported RequestPolicyFactory, RequestPolicy and RequestPolicyOptions

2018.10 Version 11.1.0-preview

* Added `uploadLocalFile` global method in `highlevel.node.ts` to support parallel uploading
* `PathURL.read` returns a response with a RetriableReadableStream, which will retry when original download stream unexpected ends.
* [Breaking] `continuation` becomes top1 layer parameters in `listFileSystemsSegment`
* [Breaking] `contentLength` parameter for `PathURL.update` is `number` type now, previous is `string`

2018.10 Version 11.0.0-preview

* Initial Private Release. API version 2018-06-17 supported. Please see the README for information on the new design.
