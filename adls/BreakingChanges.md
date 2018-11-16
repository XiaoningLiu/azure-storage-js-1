# Breaking Changes

2018.11 Version 12.0.0-preview

* [Breaking] Removed `xMsProposedLeaseId` parameter for `PathCreate` operation.
* [Breaking] Removed `xMsLeaseAction` parameter for `PathUpdate` operation.

2018.10 Version 11.1.0-preview

* [Breaking] `continuation` becomes top1 layer parameters in `listFileSystemsSegment`
* [Breaking] `contentLength` parameter for `PathURL.update` is `number` type now, previous is `string`