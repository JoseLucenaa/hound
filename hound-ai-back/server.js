import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rotas from './src/routes.js';
import { openDb } from './src/config/database.js';
import { inicializarRAG } from './src/config/ai.js'; 

dotenv.config();

const app = express();
app.use(cors()); 
app.use(express.json());

app.use('/', rotas);


async function iniciarServidor() {
    try {
        await openDb();
        console.log("📦 Banco de dados SQLite conectado e tabelas verificadas.");
        
        await inicializarRAG();
        
        app.listen(3001, () => {
            console.log("🚀 Servidor rodando na porta 3001!");
        });
    } catch (erro) {
        console.error("Erro crítico ao iniciar o sistema:", erro);
    }
}

iniciarServidor();