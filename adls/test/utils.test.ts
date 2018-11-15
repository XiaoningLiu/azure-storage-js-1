import * as assert from "assert";

import { getADLSv2PathFromURL, getFileSystemFromURL } from "../lib/utils/utils.common";

describe("utils tests", () => {
  it("getFileSystemFromURL should work", () => {
    assert.deepStrictEqual(
      getFileSystemFromURL(
        "https://myaccount.dfs.core.windows.net/myfilesystem/directory/file"
      ),
      "myfilesystem"
    );
    assert.deepStrictEqual(
      getFileSystemFromURL(
        "https://myaccount.dfs.core.windows.net/myfilesystem/directory/"
      ),
      "myfilesystem"
    );
    assert.deepStrictEqual(
      getFileSystemFromURL(
        "https://myaccount.dfs.core.windows.net/myfilesystem/directory"
      ),
      "myfilesystem"
    );
    assert.deepStrictEqual(
      getFileSystemFromURL(
        "https://myaccount.dfs.core.windows.net/myfilesystem//"
      ),
      "myfilesystem"
    );
    assert.deepStrictEqual(
      getFileSystemFromURL(
        "https://myaccount.dfs.core.windows.net/myfilesystem/"
      ),
      "myfilesystem"
    );
    assert.deepStrictEqual(
      getFileSystemFromURL(
        "https://myaccount.dfs.core.windows.net/myfilesystem"
      ),
      "myfilesystem"
    );
    assert.throws(() => {
      getFileSystemFromURL("https://myaccount.dfs.core.windows.net/");
    }, "");
    assert.throws(() => {
      getFileSystemFromURL("https://myaccount.dfs.core.windows.net");
    }, "");
  });

  it("getADLSv2PathFromURL should work", () => {
    assert.deepStrictEqual(
      getADLSv2PathFromURL(
        "https://myaccount.dfs.core.windows.net/myfilesystem/directory/file"
      ),
      "directory/file"
    );
    assert.deepStrictEqual(
      getADLSv2PathFromURL(
        "https://myaccount.dfs.core.windows.net/myfilesystem/directory/"
      ),
      "directory/"
    );
    assert.deepStrictEqual(
      getADLSv2PathFromURL(
        "https://myaccount.dfs.core.windows.net/myfilesystem/directory"
      ),
      "directory"
    );
    assert.deepStrictEqual(
      getADLSv2PathFromURL(
        "https://myaccount.dfs.core.windows.net/myfilesystem//"
      ),
      "/"
    );
    assert.deepStrictEqual(
      getADLSv2PathFromURL(
        "https://myaccount.dfs.core.windows.net/myfilesystem/"
      ),
      ""
    );
    assert.deepStrictEqual(
      getADLSv2PathFromURL(
        "https://myaccount.dfs.core.windows.net/myfilesystem"
      ),
      ""
    );
  });
});
