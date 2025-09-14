import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone as PineconeClient } from '@pinecone-database/pinecone';

import dotenv from 'dotenv';
dotenv.config();
// import fs from 'fs';
// console.log('Does .env exist?', fs.existsSync('.env'));

// console.log("PINECONE_API_KEY:", process.env.PINECONE_API_KEY);
// console.log("PINECONE_ENVIRONMENT:", process.env.PINECONE_ENVIRONMENT);
// console.log("PINECONE_INDEX_NAME:", process.env.PINECONE_INDEX_NAME);
// console.log("GROQ_API_KEY:", process.env.GROQ_API_KEY);

const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-3-small',
});

const pinecone = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY,
  controllerHostUrl: 'https://api.pinecone.io',
});


const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
});

export async function indexTheDocument(filePath) {
    const loader = new PDFLoader(filePath, { splitPages: false });
    const doc = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
    });

    const texts = await textSplitter.splitText(doc[0].pageContent);

    const documents = texts.map((chunk) => {
        return {
            pageContent: chunk,
            metadata: doc[0].metadata,
        };
    });

    await vectorStore.addDocuments(documents);
    // console.log(documents);
}