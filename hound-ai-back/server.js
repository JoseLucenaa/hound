import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rotas from './src/routes.js';

dotenv.config();

const app = express();
app.use(cors()); 
app.use(express.json()); 

app.use('/api', rotas);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor inicializado na porta ${PORT}`);
});