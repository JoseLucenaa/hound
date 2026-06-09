import fs from 'fs';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

let vectorStore;

export async function inicializarRAG() {
    console.log("📚 1. Lendo os dados do arquivo JSON...");
    const rawData = fs.readFileSync('dados.json', 'utf8');
    const jsonData = JSON.parse(rawData);

    let textoParaIA = '';
    if (Array.isArray(jsonData)) {
        textoParaIA = jsonData.map(item => JSON.stringify(item, null, 2)).join('\n\n---\n\n');
    } else {
        textoParaIA = JSON.stringify(jsonData, null, 2);
    }

    console.log("✂️ 2. Fatiando as informações em pedaços...");
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 600,
        chunkOverlap: 50,  
    });
    const documentos = await splitter.createDocuments([textoParaIA]);

    console.log("🔢 3. Criando Embeddings e salvando na memória (aguarde)...");
    const embeddings = new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HUGGINGFACE_API_KEY, 
    });
    
    vectorStore = await MemoryVectorStore.fromDocuments(documentos, embeddings);
    console.log("✅ RAG Inicializado com sucesso! O Hound está pronto.");
}

export const getVectorStore = () => vectorStore;