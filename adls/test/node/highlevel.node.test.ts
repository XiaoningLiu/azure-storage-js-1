import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import { FileSystemURL, PathURL } from "../../lib";
import { Aborter } from "../../lib/Aborter";
import { uploadLocalFile } from "../../lib/highlevel.node";
import {
  createRandomLocalFile,
  getBSU,
  getUniqueName,
  readStreamToLocalFile
} from "../utils/index";

// tslint:disable:no-empty
describe("Highlevel", () => {
  const serviceURL = getBSU();
  let fileSystemName = getUniqueName("filesystem");
  let fileSystemURL = FileSystemURL.fromServiceURL(serviceURL, fileSystemName);
  let fileName = getUniqueName("file");
  let fileURL = PathURL.fromFileSystemURL(fileSystemURL, fileName);
  let tempFileSmall: string;
  let tempFileLarge: string;
  const tempFolderPath = "temp";

  beforeEach(async () => {
    fileSystemName = getUniqueName("filesystem");
    fileSystemURL = FileSystemURL.fromServiceURL(serviceURL, fileSystemName);
    await fileSystemURL.create(Aborter.none);
    fileName = getUniqueName("file");
    fileURL = PathURL.fromFileSystemURL(fileSystemURL, fileName);
  });

  afterEach(async () => {
    await fileSystemURL.delete(Aborter.none);
  });

  before(async () => {
    if (!fs.existsSync(tempFolderPath)) {
      fs.mkdirSync(tempFolderPath);
    }
    tempFileLarge = await createRandomLocalFile(
      tempFolderPath,
      257,
      1024 * 1024
    );
    tempFileSmall = await createRandomLocalFile(
      tempFolderPath,
      15,
      1024 * 1024
    );
  });

  after(async () => {
    fs.unlinkSync(tempFileLarge);
    fs.unlinkSync(tempFileSmall);
  });

  it("uploadLocalFile should success for large files", async () => {
    await uploadLocalFile(Aborter.none, tempFileLarge, fileURL, {
      blockSize: 4 * 1024 * 1024,
      parallelism: 20
    });

    const downloadResponse = await fileURL.read(Aborter.none);
    const downloadedFile = path.join(
      tempFolderPath,
      getUniqueName("downloadfile.")
    );
    await readStreamToLocalFile(
      downloadResponse.readableStreamBody!,
      downloadedFile
    );

    const downloadedData = await fs.readFileSync(downloadedFile);
    const uploadedData = await fs.readFileSync(tempFileLarge);

    fs.unlinkSync(downloadedFile);
    assert.ok(downloadedData.equals(uploadedData));
  });

  it("uploadLocalFile should success for samll file", async () => {
    await uploadLocalFile(Aborter.none, tempFileSmall, fileURL, {
      blockSize: 4 * 1024 * 1024,
      parallelism: 20
    });

    const downloadResponse = await fileURL.read(Aborter.none);
    const downloadedFile = path.join(
      tempFolderPath,
      getUniqueName("downloadfile.")
    );
    await readStreamToLocalFile(
      downloadResponse.readableStreamBody!,
      downloadedFile
    );

    const downloadedData = await fs.readFileSync(downloadedFile);
    const uploadedData = await fs.readFileSync(tempFileSmall);

    fs.unlinkSync(downloadedFile);
    assert.ok(downloadedData.equals(uploadedData));
  });

  it("uploadLocalFile should abort for large files", async () => {
    const aborter = Aborter.timeout(1);

    try {
      await uploadLocalFile(aborter, tempFileLarge, fileURL, {
        blockSize: 4 * 1024 * 1024,
        parallelism: 20
      });
      assert.fail();
    } catch (err) {
      assert.ok((err.code as string).toLowerCase().includes("abort"));
    }
  });

  it("uploadLocalFile should abort for small files", async () => {
    const aborter = Aborter.timeout(1);

    try {
      await uploadLocalFile(aborter, tempFileSmall, fileURL, {
        blockSize: 4 * 1024 * 1024,
        parallelism: 20
      });
      assert.fail();
    } catch (err) {
      assert.ok((err.code as string).toLowerCase().includes("abort"));
    }
  });

  it("uploadLocalFile should update progress for large files", async () => {
    let eventTriggered = false;
    const aborter = Aborter.none;

    try {
      await uploadLocalFile(aborter, tempFileLarge, fileURL, {
        blockSize: 4 * 1024 * 1024,
        parallelism: 20,
        progress: ev => {
          assert.ok(ev.loadedBytes);
          eventTriggered = true;
          aborter.abort();
        }
      });
    } catch (err) {}
    assert.ok(eventTriggered);
  });

  it("uploadLocalFile should update progress for small files", async () => {
    let eventTriggered = false;
    const aborter = Aborter.none;

    try {
      await uploadLocalFile(aborter, tempFileSmall, fileURL, {
        blockSize: 4 * 1024 * 1024,
        parallelism: 20,
        progress: ev => {
          assert.ok(ev.loadedBytes);
          eventTriggered = true;
          aborter.abort();
        }
      });
    } catch (err) {}
    assert.ok(eventTriggered);
  });
});
