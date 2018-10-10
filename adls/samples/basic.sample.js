// Steps to run this sample
// 1. npm install
// 2. Enter your storage account name and shared key in main()

const {
  Aborter,
  SharedKeyCredential,
  ServiceURL,
  StorageURL,
  PathURL,
  Models,
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
      minimumLogLevel: 4,
      log: (logLevel, message) => {
        console.log(message);
      }
    }
  });

  const serviceURL = new ServiceURL(
    // When using AnonymousCredential, following url should include a valid SAS or support public access
    `https://${account}.dfs.core.windows.net`,
    pipeline
  );

  const fileSystemURL = FileSystemURL.fromServiceURL(
    serviceURL,
    `fs${new Date().getTime()}`
  );

  // Create File System
  await fileSystemURL.create(Aborter.none);

  // Get File System Properties
  let properties = await fileSystemURL.getProperties(Aborter.none);
  console.log(JSON.stringify(properties));

  // Set File System Properties
  await fileSystemURL.setProperties(Aborter.none, "h1=djE=,h3=djM=");
  properties = await fileSystemURL.getProperties(Aborter.none);
  console.log(JSON.stringify(properties));

  // List File Systems
  let marker;
  do {
    const listFileSystemsResponse = await serviceURL.listFileSystemsSegment(
      Aborter.none
    );

    marker = listFileSystemsResponse.xMsContinuation;
    for (const fileSystem of listFileSystemsResponse.filesystems) {
      console.log(`fileSystem: ${fileSystem.name}`);
      // console.log(JSON.stringify(fileSystem));

      const filesystemURL = FileSystemURL.fromServiceURL(
        serviceURL,
        fileSystem.name
      );

      const properties = await filesystemURL.getProperties(Aborter.none);
      console.log(JSON.stringify(properties));
    }
  } while (marker);

  // Create directory
  console.log("# Create directory");
  const directoryURL = PathURL.fromFileSystemURL(
    fileSystemURL,
    `mydirectory${new Date().getTime()}`
  );

  await directoryURL.create(Aborter.none, {
    resource: Models.PathResourceType.Directory
  });

  // Rename directory
  console.log("# Rename directory");
  const destDirectoryURL = PathURL.fromFileSystemURL(
    fileSystemURL,
    `destdirectory${new Date().getTime()}`
  );
  await destDirectoryURL.create(Aborter.none, {
    xMsRenameSource: `/${directoryURL.fileSystemName}/${directoryURL.path}`
  });

  // Set directory properties
  console.log("# Set directory properties");
  const setPropertiesResponse = await destDirectoryURL.update(
    Aborter.none,
    Models.PathUpdateAction.SetProperties,
    { xMsProperties: "v1=MQ==" }
  );

  // Get directory properties
  console.log("# Get directory properties");
  const directoryProperties = await destDirectoryURL.getProperties(
    Aborter.none
  );
  console.log(directoryProperties);

  // Create file
  const fileURL = PathURL.fromFileSystemURL(
    fileSystemURL,
    `${destDirectoryURL.path}/file${new Date().getTime()}`
  );

  console.log("# Create file");
  await fileURL.create(Aborter.none, {
    resource: Models.PathResourceType.File
  });

  // Update file content and commit file
  console.log("Append file content and flush");
  const content = "Hello World";
  await fileURL.update(Aborter.none, Models.PathUpdateAction.Append, {
    position: 0,
    requestBody: content
  });

  await fileURL.update(Aborter.none, Models.PathUpdateAction.Flush, {
    position: content.length
  });

  // Delete directory
  console.log("# Delete directory");
  await destDirectoryURL.delete(Aborter.none);

  // Delete File System
  await fileSystemURL.delete();
}

// An async method returns a Promise object, which is compatible with then().catch() coding style.
main()
  .then(() => {
    console.log("Successfully executed sample.");
  })
  .catch(err => {
    console.log(err);
  });
