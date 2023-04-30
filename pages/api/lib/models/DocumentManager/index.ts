import { PineconeClient } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Directory } from 'lib/models';

interface DocumentManagerInterface {}

export class DocumentManager implements DocumentManagerInterface {

    pinecone: PineconeClient;
    embedder: OpenAIEmbeddings;
    textSplitter: RecursiveCharacterTextSplitter;
    index: any;
    rootDirectory: Directory;

    constructor(root: Directory) {
        this.rootDirectory = root;
        this.pinecone = new PineconeClient()
    }

    async init() {
        await this.pinecone.init({
            environment: process.env.PINECONE_ENVIRONMENT,
            apiKey: process.env.PINECONE_API_KEY
        })

        this.index = this.pinecone.Index('root')
        this.textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 0});
        this.embedder = new OpenAIEmbeddings()
    }

}