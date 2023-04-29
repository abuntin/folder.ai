/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
import { DocumentProcessorServiceClient, protos } from '@google-cloud/documentai';

const projectId = process.env.GOOGLE_APP_ID;
const location =  process.env.DOCAI_PROJECT_LOCATION; // Format is 'us' or 'eu'
const processorId = process.env.DOCAI_DEFAULT_PROCESSOR_ID; // Create processor in Cloud Console
const filePath = '/path/to/local/pdf';

  // Instantiates a client
  const documentaiClient = new DocumentProcessorServiceClient();

  async function callBatchProcessDocuments() {
    // Construct request
    const request: protos.google.cloud.documentai.v1.IBatchProcessRequest = {
      name,
    };

    // Run request
    const [operation] = await documentaiClient.batchProcessDocuments(request);
    const [response] = await operation.promise();
    console.log(response);
  }

  callBatchProcessDocuments();