# Azure Storage SDK V10 for JavaScript - Azure Date Lake Storage Gen2 (ADLSv2)

## Introduction

This project provides a SDK in JavaScript that makes it easy to consume Microsoft Azure Storage services.

Please note that this version of the SDK is a compete overhaul of the current [Azure Storage SDK for Node.js and JavaScript in Browsers](https://github.com/azure/azure-storage-node), and is based on the new Storage SDK architecture.

### Features

* ADLS Gen2 Storage
  * Create/List/Delete File Systems
  * Create/List/Update/Delete Directories
  * Create/Read/List/Update/Delete Files
* Features new
  * Asynchronous I/O for all operations using the async methods
  * HttpPipeline which enables a high degree of per-request configurability
  * 1-to-1 correlation with the Storage REST API for clarity and simplicity

### Compatibility

This SDK is compatible with Node.js, and validated against LTS Node.js versions (>=6.5).

## Getting Started

Download and build source code:

```bash
git clone https://github.com/xiaoningliu/azure-storage-js-1
cd azure-storage-js-1/adls
npm install
```

In your project's package.json, add this package as a dependency:

```json
dependencies: {
  "@azure/storage-adls": "<path to azure-storage-js-1/adls>"
}
```

In your TypeScript or JavaScript file, import via following:

```JavaScript
import * as Azure from "@azure/storage-adls";
```

Or

```JavaScript
const Azure = require("@azure/storage-adls");
```

## SDK Architecture

The Azure Storage SDK for JavaScript provides low-level and high-level APIs.

* ServiceURL, FileSystemURL and PathURL objects provide the low-level API functionality and map one-to-one to the [Azure Storage ADLS Gen2 REST APIs](https://docs.microsoft.com/en-us/rest/api/storageservices/data-lake-storage-gen2).

* The high-level APIs provide convenience abstractions such as uploading a large local file.

## Code Samples

* [ADLS Gen2 Storage Examples](https://github.com/XiaoningLiu/azure-storage-js-1/tree/adls/adls/samples)

## License

This project is licensed under MIT.

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit <https://cla.microsoft.com.>

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
