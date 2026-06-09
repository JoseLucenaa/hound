import { ChatGroq } from '@langchain/groq';
import { getVectorStore } from '../config/ai.js';

export const processarChat = async (req, res) => {
    try {
        const { mensagem } = req.body;
        console.log(`\n💬 [Chat] Nova mensagem recebida do usuário: "${mensagem}"`);

        const vectorStore = getVectorStore();

        if (!vectorStore) {
            console.log("⚠️ [Chat] Alerta: O VectorStore não está pronto.");
            return res.status(500).json({ erro: "A IA ainda está inicializando." });
        }

        // 1. O Relógio Central
        const hoje = new Date();
        const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const diaDaSemanaHoje = diasDaSemana[hoje.getDay()];
        const dataCompleta = hoje.toLocaleDateString('pt-BR');

        // 2. A Máquina do Tempo (Tradutor de Datas)
        let diasParaAdicionar = null;
        const msgLower = mensagem.toLowerCase();

        // Identifica palavras-chave de tempo e converte em números
        if (msgLower.includes('ontem')) diasParaAdicionar = -1;
        else if (msgLower.includes('depois de amanhã') || msgLower.includes('depois de amanha')) diasParaAdicionar = 2;
        else if (msgLower.includes('amanhã') || msgLower.includes('amanha')) diasParaAdicionar = 1;
        else if (msgLower.includes('hoje')) diasParaAdicionar = 0;
        else {
            // Tenta capturar frases como "daqui a 3 dias" ou "em 5 dias"
            const regexDias = /(?:daqui a|em) (\d+) dias?/;
            const match = msgLower.match(regexDias);
            if (match) {
                diasParaAdicionar = parseInt(match[1], 10);
            }
        }

        let termoDeBusca = mensagem;
        let diaAlvo = null;

        // Se o usuário usou alguma expressão de tempo, nós calculamos qual é o dia exato!
        if (diasParaAdicionar !== null) {
            let novoDiaIndex = (hoje.getDay() + diasParaAdicionar) % 7;
            if (novoDiaIndex < 0) novoDiaIndex += 7; // Corrige a matemática para dias passados (ontem)
            
            diaAlvo = diasDaSemana[novoDiaIndex];
            termoDeBusca = `${mensagem} ${diaAlvo}`; // Força o banco a buscar o dia correto
            console.log(`⏳ [Tempo] Detectada viagem no tempo: O usuário quer saber sobre ${diaAlvo}.`);
        }

        console.log(`🔍 [Chat] Passo 1/3: Buscando no Hugging Face usando o termo: "${termoDeBusca}"...`);
        const resultados = await vectorStore.similaritySearch(termoDeBusca, 15);
        
        const contextoEncontrado = resultados.map(doc => doc.pageContent).join('\n\n');

        console.log("🤖 [Chat] Passo 2/3: Configurando o modelo Llama no Groq...");
        const chatModel = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: "llama-3.1-8b-instant", 
            temperature: 0.1, 
        });

        // 3. Prompt com injeção do dia exato para a IA não precisar adivinhar nada
        const prompt = `Você é o Hound, um assistente virtual escolar inteligente e prestativo.
        
        INFORMAÇÃO DO CALENDÁRIO:
        - Hoje é ${diaDaSemanaHoje}, dia ${dataCompleta}.
        ${diaAlvo ? `- O usuário está perguntando especificamente sobre fatos que ocorrem na: ${diaAlvo}.` : ''}
        
        REGRAS DE OURO:
        1. Responda de forma DIRETA, sem enrolação.
        2. NÃO USE formatação Markdown (como asteriscos ** ou #). O sistema do usuário não suporta. Use apenas texto simples.
        3. Para listar itens, use traços simples (-) e pule linhas para ficar bem legível.
        4. Use APENAS as informações do CONTEXTO fornecido abaixo.
        5. Se a informação solicitada não estiver no contexto, diga apenas: "Desculpe, não tenho essa informação nos meus arquivos."
        6. Baseie sua resposta no dia alvo informado acima, se houver.
        
        CONTEXTO ENCONTRADO NOS ARQUIVOS:
        ${contextoEncontrado}

        PERGUNTA DO USUÁRIO: ${mensagem}`;

        console.log("🚀 [Chat] Passo 3/3: Enviando Prompt para o Groq...");
        const resposta = await chatModel.invoke(prompt);
        console.log("✨ [Chat] Passo 3/3 Concluído!");

        res.json({ resposta: resposta.content });

    } catch (erro) {
        console.error("❌ [Chat] ERRO CRÍTICO detectado no processamento do Chat:", erro);
        res.status(500).json({ resposta: "Ops, ocorreu um erro no servidor ao processar a IA." });
    }
};