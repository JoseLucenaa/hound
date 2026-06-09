import express from 'express';
import { cadastrar, login } from './controllers/authController.js';
import { processarChat } from './controllers/chatController.js';
import { verificarToken } from './middlewares/authMiddleware.js';

const router = express.Router();

router.post('/cadastro', cadastrar);
router.post('/login', login);
router.post('/chat', verificarToken, processarChat); 

export default router;