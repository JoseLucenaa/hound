import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { openDb } from '../config/database.js';

// Regex simples para validar formato de e-mail (ex: teste@teste.com)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const cadastrar = async (req, res) => {
    const { nome, email, senha } = req.body;

    // --- INÍCIO DAS VALIDAÇÕES ---
    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: "Todos os campos (nome, email, senha) são obrigatórios." });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ erro: "Por favor, insira um formato de e-mail válido." });
    }

    if (senha.length < 6) {
        return res.status(400).json({ erro: "A senha deve ter pelo menos 6 caracteres." });
    }
    // --- FIM DAS VALIDAÇÕES ---

    try {
        const db = await openDb();
        
        // Verifica se o e-mail já existe
        const usuarioExiste = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (usuarioExiste) {
            return res.status(400).json({ erro: "Este e-mail já está em uso." });
        }

        // Criptografa a senha antes de salvar
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        // Insere no banco
        await db.run('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senhaCriptografada]);

        res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
    } catch (erro) {
        console.error("Erro no cadastro:", erro);
        res.status(500).json({ erro: "Erro interno ao cadastrar usuário." });
    }
};

export const login = async (req, res) => {
    const { email, senha } = req.body;

    // --- INÍCIO DAS VALIDAÇÕES ---
    if (!email || !senha) {
        return res.status(400).json({ erro: "E-mail e senha são obrigatórios para o login." });
    }
    // --- FIM DAS VALIDAÇÕES ---

    try {
        const db = await openDb();

        // Busca o usuário pelo e-mail
        const usuario = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (!usuario) {
            return res.status(400).json({ erro: "E-mail ou senha incorretos." });
        }

        // Compara a senha digitada com a criptografada no banco
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ erro: "E-mail ou senha incorretos." });
        }

        // Gera o Token JWT válido por 24 horas
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.json({ 
            mensagem: "Login realizado com sucesso!",
            token: token,
            usuario: { nome: usuario.nome, email: usuario.email }
        });
    } catch (erro) {
        console.error("Erro no login:", erro);
        res.status(500).json({ erro: "Erro interno ao fazer login." });
    }
};