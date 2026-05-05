import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/huggingface';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { ChatGroq } from '@langchain/groq';

// Carrega as senhas do arquivo .env
dotenv.config();

const app = express();
app.use(cors()); // Permite que o app do celular converse com este servidor
app.use(express.json());

// Variável que vai guardar nosso "Banco de Dados" na memória RAM
let vectorStore;

// --- FASE 1: O PREPARO (Alimentando o RAG) ---
async function inicializarRAG() {
    console.log("📚 1. Lendo os dados do arquivo txt...");
    const texto = fs.readFileSync('dados.txt', 'utf8');

    console.log("✂️ 2. Fatiando o texto em pedaços...");
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,    // Tamanho máximo de cada pedaço
        chunkOverlap: 50,  // Sobreposição para não cortar ideias no meio
    });
    const documentos = await splitter.createDocuments([texto]);

    console.log("🔢 3. Criando Embeddings e salvando na memória (aguarde)...");
    const embeddings = new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HUGGINGFACE_API_KEY, 
    });
    
    // Cria o banco de dados na hora usando a memória do computador
    vectorStore = await MemoryVectorStore.fromDocuments(documentos, embeddings);
    console.log("✅ RAG Inicializado com sucesso! O Hound está pronto.");
}

// Liga o RAG assim que o servidor iniciar
inicializarRAG();


// --- FASE 2: A CONVERSA (Endpoint que o app vai chamar) ---
app.post('/chat', async (req, res) => {
    try {
        // Recebe a mensagem do app React Native
        const { mensagem } = req.body;

        // 1. Busca no banco de dados os textos que combinam com a pergunta
        const resultados = await vectorStore.similaritySearch(mensagem, 3);
        
        // 2. Junta os textos encontrados
        const contextoEncontrado = resultados.map(doc => doc.pageContent).join('\n\n');

        // 3. Prepara a IA da Groq
        const chatModel = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: "llama3-8b-8192", // Modelo rápido e recomendado
            temperature: 0.2, // Temperatura baixa para respostas mais exatas
        });

        // 4. Monta o Super Prompt (O Guardrail Principal do RAG)
        const prompt = `Você é o Hound. Responda a pergunta do usuário baseando-se APENAS no contexto fornecido abaixo. 
        Se a resposta não estiver no contexto, diga simplesmente: "Desculpe, não tenho essa informação nos meus arquivos."
        Use formatação Markdown.
        
        CONTEXTO ENCONTRADO NOS ARQUIVOS:
        ${contextoEncontrado}

        PERGUNTA DO USUÁRIO: ${mensagem}`;

        // 5. Pede a resposta para a Groq
        const resposta = await chatModel.invoke(prompt);

        // 6. Devolve a resposta final para o celular
        res.json({ resposta: resposta.content });

    } catch (erro) {
        console.error("Erro no chat:", erro);
        res.status(500).json({ resposta: "Ops, ocorreu um erro no servidor." });
    }
});

// Inicia o servidor
app.listen(3000, () => {
    console.log("🚀 Servidor rodando na porta 3000!");
});