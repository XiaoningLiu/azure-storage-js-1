import * as assert from "assert";

import { Models, RestError } from "../lib";
import { Aborter } from "../lib/Aborter";
import { FileSystemURL } from "../lib/FileSystemURL";
import { PathURL } from "../lib/PathURL";
import { getBSU, getUniqueName } from "./utils";

describe("FileSystemURL", () => {
  const serviceURL = getBSU();
  let fileSystemName: string = getUniqueName("filesystem");
  let fileSystemURL = FileSystemURL.fromServiceURL(serviceURL, fileSystemName);

  beforeEach(async () => {
    fileSystemName = getUniqueName("filesystem");
    fileSystemURL = FileSystemURL.fromServiceURL(serviceURL, fileSystemName);
    await fileSystemURL.create(Aborter.none);
  });

  afterEach(async () => {
    await fileSystemURL.delete(Aborter.none);
  });

  it("create", async () => {
    assert.ok(
      true,
      "FileSystemURL.create should be already covered in beforeEach"
    );
  });

  it("create with $web filesystem", async () => {
    const fileSystemURlDollar = FileSystemURL.fromServiceURL(serviceURL, "$web");
    try {
      await fileSystemURlDollar.getProperties(Aborter.none);
    } catch (err) {
      if ((err as RestError).statusCode === 404) {
        await fileSystemURlDollar.create(Aborter.none);
      }

      await fileSystemURlDollar.getProperties(Aborter.none);
    }
  });

  it("create with all parameter configured", async () => {
    const anotherFileSystemName = getUniqueName("filesystem");
    const anotherFileSystemURL = FileSystemURL.fromServiceURL(
      serviceURL,
      anotherFileSystemName
    );

    const xMsProperties = "f1=djE=,f3=djM=";
    await anotherFileSystemURL.create(Aborter.none, {
      xMsProperties
    });

    const properties = await anotherFileSystemURL.getProperties(Aborter.none);

    assert.deepStrictEqual(properties.xMsProperties, xMsProperties);
    assert.ok(properties.xMsVersion);
    assert.ok(properties.xMsRequestId);
    assert.ok(properties.xMsNamespaceEnabled !== undefined);
    assert.ok(properties.lastModified);
    assert.ok(properties.eTag);
    assert.ok(properties.date);

    await anotherFileSystemURL.delete(Aborter.none);
  });

  it("delete", async () => {
    assert.ok(
      true,
      "FileSystemURL.delete should be already covered in afterEach"
    );
  });

  it("delete with all parameters configured", async () => {
    const anotherFileSystemName1 = getUniqueName("filesystem");
    const anotherFileSystemURL1 = FileSystemURL.fromServiceURL(
      serviceURL,
      anotherFileSystemName1
    );
    await anotherFileSystemURL1.create(Aborter.none);

    const anotherFileSystemName2 = getUniqueName("filesystem");
    const anotherFileSystemURL2 = FileSystemURL.fromServiceURL(
      serviceURL,
      anotherFileSystemName2
    );
    await anotherFileSystemURL2.create(Aborter.none);

    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    await anotherFileSystemURL1.delete(Aborter.none, {
      ifUnmodifiedSince: now.toISOString()
    });

    await anotherFileSystemURL2.delete(Aborter.none, {
      ifModifiedSince: yesterday.toISOString()
    });
  });

  it("setProperties", async () => {
    const xMsProperties = "f1=djE=,f3=djM=";
    await fileSystemURL.setProperties(Aborter.none, xMsProperties, {
      ifUnmodifiedSince: new Date().toISOString()
    });

    const properties = await fileSystemURL.getProperties(Aborter.none);

    assert.deepStrictEqual(properties.xMsProperties, xMsProperties);
    assert.ok(properties.xMsVersion);
    assert.ok(properties.xMsRequestId);
    assert.ok(properties.xMsNamespaceEnabled !== undefined);
    assert.ok(properties.lastModified);
    assert.ok(properties.eTag);
    assert.ok(properties.date);
  });

  it("getProperties", async () => {
    assert.ok(
      true,
      'FileSystemURL.getProperties should be already covered in it("setProperties")'
    );
  });

  it("listPathsSegment", async () => {
    const dir1 = getUniqueName("dir1");
    const directoryURL1 = PathURL.fromFileSystemURL(fileSystemURL, dir1);
    await directoryURL1.create(Aborter.none, Models.PathResourceType.Directory);

    const fileURL1 = PathURL.fromPathURL(directoryURL1, getUniqueName("file1"));
    await fileURL1.create(Aborter.none, Models.PathResourceType.File);

    const directoryURL2 = PathURL.fromFileSystemURL(
      fileSystemURL,
      getUniqueName("dir2")
    );
    await directoryURL2.create(Aborter.none, Models.PathResourceType.Directory);

    const fileURL2 = PathURL.fromPathURL(directoryURL2, getUniqueName("file2"));
    await fileURL2.create(Aborter.none, Models.PathResourceType.File);

    const listDirectoriesFilesNoneRecursive = await fileSystemURL.listPathsSegment(
      Aborter.none,
      false
    );
    assert.deepStrictEqual(listDirectoriesFilesNoneRecursive.paths!.length, 2);

    const listDirectoriesFilesRecursive = await fileSystemURL.listPathsSegment(
      Aborter.none,
      true
    );
    assert.deepStrictEqual(listDirectoriesFilesRecursive.paths!.length, 4);

    const listDirectoriesFiltered = await fileSystemURL.listPathsSegment(
      Aborter.none,
      false,
      { directory: dir1 }
    );
    assert.deepStrictEqual(listDirectoriesFiltered.paths!.length, 1);

    await directoryURL1.delete(Aborter.none, { recursive: true });
    await directoryURL2.delete(Aborter.none, { recursive: true });
  });
});
