// Steps to run this sample
// 1. npm install
// 2. Enter your storage account name and shared key in main()
import { ConsoleHttpPipelineLogger } from "ms-rest-js/es/lib/httpPipelineLogger";
import {
  Aborter,
  FileSystemURL,
  HttpPipelineLogLevel,
  ServiceURL,
  SharedKeyCredential,
  StorageURL
} from "../lib/index";

async function main() {
  // Enter your storage account name and shared key
  const account = "jiactestbfsoauth02";
  const accountKey =
    "w5wUYEN3iNqz+5MqJgLMPzgudBynDsvtB9J77hLXQTTylZJoI1hA2aGqi5cFLcXl97E0lsDNEGNQ9hQYFGkptw==";

  // Use SharedKeyCredential with storage account and account key
  const sharedKeyCredential = new SharedKeyCredential(account, accountKey);

  // Use sharedKeyCredential, tokenCredential or tokenCredential to create a pipeline
  const pipeline = StorageURL.newPipeline(sharedKeyCredential, {
    // Enable logger when debugging
    logger: new ConsoleHttpPipelineLogger(HttpPipelineLogLevel.INFO)
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
    for (const fileSystem of listFileSystemsResponse.filesystems!) {
      console.log(`fileSystem: ${fileSystem.name}`);
      console.log(JSON.stringify(fileSystem));

      const filesystemURL = FileSystemURL.fromServiceURL(
        serviceURL,
        fileSystem.name!
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
