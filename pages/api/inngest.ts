import { ref } from 'firebase/storage';
import { Inngest, NonRetriableError } from 'inngest';
import { serve } from 'inngest/next';
import { Directory } from 'lib/models';
import { processDocumentType } from './lib/functions/documentai';
import { root } from './lib/models/firebase';

// Create a client to send and receive events
export const inngest = new Inngest({ name: 'FolderAI', eventKey: process.env.INNGEST_EVENT_KEY });

const helloWorld = inngest.createFunction(
  { name: 'Hello World' },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    await step.sleep('1s');
    return { event, body: 'Hello, World!' };
  }
);

const processDocuments = inngest.createFunction(
    { name: 'Process Upload' },
    { event: 'documentai/on.upload' },
    async ({ event, step }) => {
      await step.sleep('1s');
  
      let { documents, directory } = await step.run('Get args', () => {
        let {
          payload: { documents, directory },
        } = event.data;
  
        if (!documents || !directory) throw new NonRetriableError('Missing args');
  
        if (!directory.path || !Array.isArray(documents)) throw new NonRetriableError('Invalid args')
  
        return { documents, directory } as { documents: string[], directory: Directory };
  
      });
  
      await step.run(`Process Documents`, async () => {
        try {
          let _srcRef = ref(root, `${directory.path}/.documentai`);
  
          let _outputRef = ref(_srcRef, `/.folderai`);
  
          for (let type of documents.values()) {
            await step.run(
              `Process mimetype ${type} in ${directory.name}`,
              async () =>
                await processDocumentType({
                  type,
                  src: _srcRef,
                  dest: _outputRef,
                })
            );
          }
        } catch (e) {
          throw new NonRetriableError(e.message);
        }
      });
    }
  );
  

// Create an API that hosts zero functions
export default serve(inngest, [helloWorld, processDocuments]);
