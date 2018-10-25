import * as assert from "assert";

import { Aborter } from "../lib/Aborter";
import { FileSystemURL } from "../lib/FileSystemURL";
import { getBSU, getUniqueName } from "./utils";

describe("ServiceURL", () => {
  it("listFileSystemsSegment with default parameters", async () => {
    const serviceURL = getBSU();
    const result = await serviceURL.listFileSystemsSegment(Aborter.none);
    assert.ok(typeof result.xMsRequestId);
    assert.ok(result.xMsRequestId!.length > 0);
    assert.ok(typeof result.xMsVersion);
    assert.ok(result.xMsVersion!.length > 0);

    assert.ok(result.filesystems!.length >= 0);

    if (result.filesystems!.length > 0) {
      const fileSystem = result.filesystems![0];
      assert.ok(fileSystem.name!.length > 0);
      assert.notEqual(fileSystem.lastModified, undefined);
      assert.notEqual(fileSystem.eTag, undefined);
    }
  });

  it("listFileSystemsSegment with all parameters configured", async () => {
    const serviceURL = getBSU();

    const fileSystemNamePrefix = getUniqueName("filesystem");
    const fileSystemName1 = `${fileSystemNamePrefix}x1`;
    const fileSystemName2 = `${fileSystemNamePrefix}x2`;
    const fileSystemURL1 = FileSystemURL.fromServiceURL(
      serviceURL,
      fileSystemName1
    );
    const fileSystemURL2 = FileSystemURL.fromServiceURL(
      serviceURL,
      fileSystemName2
    );
    await fileSystemURL1.create(Aborter.none, {
      xMsProperties: "f1=djE=,f3=djM="
    });
    await fileSystemURL2.create(Aborter.none, { xMsProperties: "h1=djE=" });

    const result1 = await serviceURL.listFileSystemsSegment(
      Aborter.none,
      undefined,
      {
        maxResults: 1,
        prefix: fileSystemNamePrefix
      }
    );

    assert.ok(result1.xMsContinuation);
    assert.equal(result1.filesystems!.length, 1);
    assert.ok(result1.filesystems![0].name!.startsWith(fileSystemNamePrefix));
    assert.ok(result1.filesystems![0].eTag!.length > 0);
    assert.ok(result1.filesystems![0].lastModified);

    const result2 = await serviceURL.listFileSystemsSegment(
      Aborter.none,
      result1.xMsContinuation,
      {
        maxResults: 1,
        prefix: fileSystemNamePrefix
      }
    );

    assert.equal(result2.filesystems!.length, 1);
    assert.ok(result2.filesystems![0].name!.startsWith(fileSystemNamePrefix));
    assert.ok(result2.filesystems![0].eTag!.length > 0);
    assert.ok(result2.filesystems![0].lastModified);

    await fileSystemURL1.delete(Aborter.none);
    await fileSystemURL2.delete(Aborter.none);
  });
});
