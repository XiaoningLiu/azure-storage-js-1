// Steps to run this sample
// 1. npm install
// 2. Enter your storage account name and shared key in main()

const {
  Aborter,
  SharedKeyCredential,
  ServiceURL,
  StorageURL,
  FileSystemURL
} = require("..");

async function main() {
  // Enter your storage account name and shared key
  const account = "";
  const accountKey = "";

  // Use SharedKeyCredential with storage account and account key
  const sharedKeyCredential = new SharedKeyCredential(account, accountKey);

  // Use sharedKeyCredential, tokenCredential or tokenCredential to create a pipeline
  const pipeline = StorageURL.newPipeline(sharedKeyCredential, {
    logger: {
      minimumLogLevel: 0,
      log: (logLevel, message) => {
        console.log(message);
      }
    }
  });

  // List containers
  const serviceURL = new ServiceURL(
    // When using AnonymousCredential, following url should include a valid SAS or support public access
    `https://${account}.dfs.core.windows.net`,
    pipeline
  );

  let marker;
  do {
    const listFileSystemsResponse = await serviceURL.listFileSystemsSegment(
      Aborter.none
    );

    marker = listFileSystemsResponse.xMsContinuation;
    for (const fileSystem of listFileSystemsResponse.filesystems) {
      console.log(`fileSystem: ${fileSystem.name}`);
      console.log(JSON.stringify(fileSystem));

      const filesystemURL = FileSystemURL.fromServiceURL(
        serviceURL,
        fileSystem.name
      );

      const properties = await filesystemURL.getProperties(Aborter.none);
      console.log(JSON.stringify(properties));
    }
  } while (marker);
}

// An async method returns a Promise object, which is compatible with then().catch() coding style.
main()
  .then(() => {
    console.log("Successfully executed sample.");
  })
  .catch(err => {
    console.log(err);
  });
