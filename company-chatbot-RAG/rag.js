/**
 * Implementation plan
 * Stage 1: Indexting
 * 1. Load the document - pdf, text - completed
 * 2. Chunk the document - completed
 * 3. Generate vector embeddings - completed

 *
 * Stage 2: Using the chatbot
 * 1. Setup LLM 
 * 2. Add retrieval step
 * 3. Pass input + relevant information to LLM
 * 4. Congratulations
 */

import { indexTheDocument } from './prepare.js';

const filePath = './cg-internal-docs.pdf';
indexTheDocument(filePath);