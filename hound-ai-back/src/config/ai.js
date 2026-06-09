import fs from 'fs';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { Document } from 'langchain/document'; // <- Importação nova!

let vectorStore;

export async function inicializarRAG() {
    console.log("📚 1. Lendo os dados do arquivo JSON...");
    const rawData = fs.readFileSync('dados.json', 'utf8');
    const jsonData = JSON.parse(rawData);

    console.log("📦 2. Empacotando os dados (Sem fatiar!)...");
    // Transforma cada bloco do JSON em um documento blindado e separado
    const documentos = jsonData.map(item => {
        return new Document({
            pageContent: JSON.stringify(item, null, 2),
            metadata: { categoria: item.categoria || 'geral' }
        });
    });

    console.log("🔢 3. Criando Embeddings na nuvem do Hugging Face (aguarde)...");
    
    try {
        const embeddings = new HuggingFaceInferenceEmbeddings({
            apiKey: process.env.HUGGINGFACE_API_KEY, 
            model: "sentence-transformers/all-MiniLM-L6-v2", 
        });
        
        vectorStore = await MemoryVectorStore.fromDocuments(documentos, embeddings);
        console.log("✅ RAG Inicializado com sucesso! O Hound está pronto.");
    } catch (erro) {
        console.error("\n❌ ERRO FATAL AO CRIAR EMBEDDINGS:", erro.message);
    }
}

export const getVectorStore = () => vectorStore;