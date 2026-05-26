import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { ChatGroq } from '@langchain/groq';

// Carrega as senhas do arquivo .env
dotenv.config();

const app = express();
app.use(cors()); 
app.use(express.json());

let vectorStore;

// --- FASE 1: O PREPARO (Lendo e Entendendo o JSON) ---
async function inicializarRAG() {
    console.log("📚 1. Lendo os dados do arquivo JSON...");
    
    // Lê o arquivo JSON
    const rawData = fs.readFileSync('dados.json', 'utf8');
    const jsonData = JSON.parse(rawData);

    // Transformando o JSON em texto legível para a IA
    // Se for uma lista (Array), ele separa cada item com linhas. Se for um objeto único, formata direto.
    let textoParaIA = '';
    if (Array.isArray(jsonData)) {
        textoParaIA = jsonData.map(item => JSON.stringify(item, null, 2)).join('\n\n---\n\n');
    } else {
        textoParaIA = JSON.stringify(jsonData, null, 2);
    }

    console.log("✂️ 2. Fatiando as informações em pedaços...");
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 600,    // Aumentei um pouco para caber objetos JSON inteiros
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

inicializarRAG();


// --- FASE 2: A CONVERSA (Continua igual) ---
app.post('/chat', async (req, res) => {
    try {
        const { mensagem } = req.body;

        const resultados = await vectorStore.similaritySearch(mensagem, 3);
        const contextoEncontrado = resultados.map(doc => doc.pageContent).join('\n\n');

        const chatModel = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: "llama-3.1-8b-instant", 
            temperature: 0.2, 
        });

        const prompt = `Você é o Hound. Responda a pergunta do usuário baseando-se APENAS no contexto fornecido abaixo. 
        O contexto pode estar no formato JSON. Interprete os dados e responda de forma natural e amigável.
        Se a resposta não estiver no contexto, diga simplesmente: "Desculpe, não tenho essa informação nos meus arquivos."
        Use formatação Markdown.
        
        CONTEXTO ENCONTRADO NOS ARQUIVOS:
        ${contextoEncontrado}

        PERGUNTA DO USUÁRIO: ${mensagem}`;

        const resposta = await chatModel.invoke(prompt);
        res.json({ resposta: resposta.content });

    } catch (erro) {
        console.error("Erro no chat:", erro);
        res.status(500).json({ resposta: "Ops, ocorreu um erro no servidor." });
    }
});

app.listen(3000, () => {
    console.log("🚀 Servidor rodando na porta 3000!");
});