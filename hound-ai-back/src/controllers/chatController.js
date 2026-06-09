import { ChatGroq } from '@langchain/groq';
import { getVectorStore } from '../config/ai.js';

export const processarChat = async (req, res) => {
    try {
        const { mensagem } = req.body;
        const vectorStore = getVectorStore();

        if (!vectorStore) {
            return res.status(500).json({ erro: "A IA ainda está inicializando. Tente novamente em instantes." });
        }

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
        res.status(500).json({ resposta: "Ops, ocorreu um erro no servidor ao processar a IA." });
    }
};