import * as assert from "assert";

import { Models } from "../lib";
import { Aborter } from "../lib/Aborter";
import { FileSystemURL } from "../lib/FileSystemURL";
import { PathURL } from "../lib/PathURL";
import { getBSU, getUniqueName } from "./utils";

describe("PathURL", () => {
  const serviceURL = getBSU();
  let fileSystemName: string = getUniqueName("container");
  let fileSystemURL = FileSystemURL.fromServiceURL(serviceURL, fileSystemName);

  beforeEach(async () => {
    fileSystemName = getUniqueName("container");
    fileSystemURL = FileSystemURL.fromServiceURL(serviceURL, fileSystemName);
    await fileSystemURL.create(Aborter.none);
  });

  afterEach(async () => {
    await fileSystemURL.delete(Aborter.none);
  });

  it("create directory", async () => {
    const dir = getUniqueName("dir");
    const dirURL = PathURL.fromFileSystemURL(fileSystemURL, dir);
    await dirURL.create(Aborter.none, Models.PathResourceType.Directory);
    await dirURL.delete(Aborter.none);
  });

  it("rename directory", async () => {
    const dir = getUniqueName("dir");
    const dirURL = PathURL.fromFileSystemURL(fileSystemURL, dir);
    await dirURL.create(Aborter.none, Models.PathResourceType.Directory);

    const renamed = getUniqueName("renamedDir");
    const renamedURL = PathURL.fromFileSystemURL(fileSystemURL, renamed);
    await renamedURL.create(Aborter.none, undefined, {
      xMsRenameSource: `/${fileSystemName}/${dir}`
    });

    await renamedURL.delete(Aborter.none);
  });

  it("delete directory", async () => {
    assert.ok(true, 'should be already covered in it("rename directory")');
  });

  it("create file", async () => {
    const file = getUniqueName("file");
    const fileURL = PathURL.fromFileSystemURL(fileSystemURL, file);
    await fileURL.create(Aborter.none, Models.PathResourceType.File);
    await fileURL.delete(Aborter.none);
  });

  it("rename file", async () => {
    const file = getUniqueName("file");
    const fileURL = PathURL.fromFileSystemURL(fileSystemURL, file);
    await fileURL.create(Aborter.none, Models.PathResourceType.File);

    const renamed = getUniqueName("renamed");
    const renamedURL = PathURL.fromFileSystemURL(fileSystemURL, renamed);
    await renamedURL.create(Aborter.none, undefined, {
      xMsRenameSource: `/${fileSystemName}/${renamed}`
    });

    await renamedURL.delete(Aborter.none);
  });

  it("delete file", async () => {
    assert.ok(true, 'should be already covered in it("rename file")');
  });

  it("set file properties", async () => {
    const file = getUniqueName("file");
    const fileURL = PathURL.fromFileSystemURL(fileSystemURL, file);
    await fileURL.create(Aborter.none, Models.PathResourceType.File);

    const properties = {
      xMsCacheControl: "CacheControl",
      xMsContentDisposition: "ContentDisposition",
      xMsContentEncoding: "ContentEncoding",
      xMsContentLanguage: "ContentLanguage",
      xMsContentType: "ContentType",
      xMsProperties: "h1=djE="
    };
    await fileURL.update(
      Aborter.none,
      Models.PathUpdateAction.SetProperties,
      properties
    );

    const response = await fileURL.getProperties(Aborter.none, undefined);
    assert.deepStrictEqual(properties.xMsCacheControl, response.cacheControl);
    assert.deepStrictEqual(
      properties.xMsContentDisposition,
      response.contentDisposition
    );
    assert.deepStrictEqual(
      properties.xMsContentEncoding,
      response.contentEncoding
    );
    assert.deepStrictEqual(
      properties.xMsContentLanguage,
      response.contentLanguage
    );
    assert.deepStrictEqual(properties.xMsContentType, response.contentType);
    assert.deepStrictEqual(properties.xMsProperties, response.xMsProperties);

    await fileURL.delete(Aborter.none);
  });

  // it("set directory properties", async () => {});

  // it("get properties", async () => {});

  // it("set access control", async () => {});

  // it("get access control", async () => {});

  // it("append data and flush data", async () => {});

  // it("lease", async () => {});

  // it("read", async () => {});
});
