import * as assert from "assert";

import { Models } from "../lib";
import { Aborter } from "../lib/Aborter";
import { FileSystemURL } from "../lib/FileSystemURL";
import { PathURL } from "../lib/PathURL";
import { bodyToString, getBSU, getUniqueName } from "./utils";

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
    const dir = getUniqueName("dir");
    const dirURL = PathURL.fromFileSystemURL(fileSystemURL, dir);
    await dirURL.create(Aborter.none, Models.PathResourceType.Directory);

    const file = getUniqueName("file");
    const fileURL = PathURL.fromPathURL(dirURL, file);
    await fileURL.create(Aborter.none, Models.PathResourceType.File);

    const renamed = getUniqueName("renamed");
    const renamedURL = PathURL.fromFileSystemURL(fileSystemURL, renamed);
    await renamedURL.create(Aborter.none, undefined, {
      xMsRenameSource: `/${fileSystemName}/${dir}/${file}`
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

  it("set directory properties", async () => {
    const dir = getUniqueName("dir");
    const dirURL = PathURL.fromFileSystemURL(fileSystemURL, dir);
    await dirURL.create(Aborter.none, Models.PathResourceType.Directory);

    const properties = {
      xMsCacheControl: "CacheControl",
      xMsContentDisposition: "ContentDisposition",
      xMsContentEncoding: "ContentEncoding",
      xMsContentLanguage: "ContentLanguage",
      xMsContentType: "ContentType",
      xMsProperties: "h1=djE="
    };
    await dirURL.update(
      Aborter.none,
      Models.PathUpdateAction.SetProperties,
      properties
    );

    const response = await dirURL.getProperties(Aborter.none, undefined);
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
  });

  it("get root directory properties", async () => {
    const rootDirURL = PathURL.fromFileSystemURL(fileSystemURL, "");
    await rootDirURL.getProperties(Aborter.none, undefined);
  });

  it("get properties", async () => {
    assert.ok(
      true,
      'should be already covered in it("set directory properties")'
    );
  });

  it("set access control", async () => {
    const file = getUniqueName("file");
    const fileURL = PathURL.fromFileSystemURL(fileSystemURL, file);
    await fileURL.create(Aborter.none, Models.PathResourceType.File);

    const xMsAcl = "user::rwx,group::r-x,other::-w-";
    const xMsOwner = "xiaonli@microsoft.com";
    const xMsGroup = "mygroup";
    await fileURL.update(
      Aborter.none,
      Models.PathUpdateAction.SetAccessControl,
      {
        xMsAcl,
        xMsGroup,
        xMsOwner
      }
    );

    const properties = await fileURL.getProperties(
      Aborter.none,
      Models.PathGetPropertiesAction.GetAccessControl
    );

    assert.deepStrictEqual(properties.xMsAcl, xMsAcl);
    assert.deepStrictEqual(properties.xMsPermissions, "rwxr-x-w-");
    assert.deepStrictEqual(properties.xMsOwner, xMsOwner);
    assert.deepStrictEqual(properties.xMsGroup, xMsGroup);
  });

  it("get access control", async () => {
    assert.ok(true, 'should be already covered in it("set access control")');
  });

  it("lease", async () => {
    const file = getUniqueName("file");
    const fileURL = PathURL.fromFileSystemURL(fileSystemURL, file);
    await fileURL.create(Aborter.none, Models.PathResourceType.File);
    await fileURL.lease(Aborter.none, Models.PathLeaseAction.Acquire, {
      xMsLeaseDuration: 30,
      xMsProposedLeaseId: "1f812371-a41d-49e6-b123-f4b542e851c5"
    });

    // TODO: Cannot lease a ADLSv2 file
    // const properties = await fileURL.getProperties(Aborter.none, undefined);
  });

  it("append data and flush data", async () => {
    const file = getUniqueName("file");
    const fileURL = PathURL.fromFileSystemURL(fileSystemURL, file);
    await fileURL.create(Aborter.none, Models.PathResourceType.File);

    const hello = "hello";
    const world = "world";
    await fileURL.update(Aborter.none, Models.PathUpdateAction.Append, {
      contentLength: hello.length,
      position: 0,
      requestBody: hello
    });
    await fileURL.update(Aborter.none, Models.PathUpdateAction.Append, {
      contentLength: world.length,
      position: hello.length,
      requestBody: world
    });
    await fileURL.update(Aborter.none, Models.PathUpdateAction.Flush, {
      contentLength: 0,
      position: world.length + hello.length
    });

    const properties = await fileURL.getProperties(Aborter.none, undefined);
    assert.equal(properties.contentLength, hello.length + world.length);
  });

  it("read", async () => {
    const file = getUniqueName("file");
    const fileURL = PathURL.fromFileSystemURL(fileSystemURL, file);
    await fileURL.create(Aborter.none, Models.PathResourceType.File);

    const hello = "Hello ";
    const world = "world";
    await fileURL.update(Aborter.none, Models.PathUpdateAction.Append, {
      contentLength: hello.length,
      position: 0,
      requestBody: hello
    });
    await fileURL.update(Aborter.none, Models.PathUpdateAction.Append, {
      contentLength: world.length,
      position: hello.length,
      requestBody: world
    });
    await fileURL.update(Aborter.none, Models.PathUpdateAction.Flush, {
      contentLength: 0,
      position: world.length + hello.length
    });

    const response = await fileURL.read(Aborter.none);
    assert.deepStrictEqual(
      await bodyToString(response, hello.length + world.length),
      hello + world
    );
  });

  it.only("read partial content", async () => {
    const file = getUniqueName("file");
    const fileURL = PathURL.fromFileSystemURL(fileSystemURL, file);
    await fileURL.create(Aborter.none, Models.PathResourceType.File);

    const hello = "Hello ";
    const world = "world";
    await fileURL.update(Aborter.none, Models.PathUpdateAction.Append, {
      contentLength: hello.length,
      position: 0,
      requestBody: hello
    });
    await fileURL.update(Aborter.none, Models.PathUpdateAction.Append, {
      contentLength: world.length,
      position: hello.length,
      requestBody: world
    });
    await fileURL.update(Aborter.none, Models.PathUpdateAction.Flush, {
      contentLength: 0,
      position: world.length + hello.length
    });

    const response = await fileURL.read(Aborter.none, {
      range: {
        count: 6,
        offset: 0
      }
    });
    assert.deepStrictEqual(
      await bodyToString(response, hello.length + world.length),
      hello
    );
  });
});
