import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { openDb } from '../config/database.js';

// Regex simples para validar formato de e-mail
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const cadastrar = async (req, res) => {
    const { nome, email, senha } = req.body;
    
    console.log(`\n[Cadastro] Nova tentativa de cadastro iniciada para o e-mail: ${email}`);

    // --- INÍCIO DAS VALIDAÇÕES ---
    if (!nome || !email || !senha) {
        console.log("[Cadastro] Falha: Campos obrigatórios não foram preenchidos.");
        return res.status(400).json({ erro: "Todos os campos (nome, email, senha) são obrigatórios." });
    }

    if (!emailRegex.test(email)) {
        console.log(`[Cadastro] Falha: E-mail mal formatado (${email}).`);
        return res.status(400).json({ erro: "Por favor, insira um formato de e-mail válido." });
    }

    if (senha.length < 6) {
        console.log("[Cadastro] Falha: Senha muito curta.");
        return res.status(400).json({ erro: "A senha deve ter pelo menos 6 caracteres." });
    }
    // --- FIM DAS VALIDAÇÕES ---

    try {
        const db = await openDb();
        
        console.log(`[Cadastro] Verificando se o e-mail ${email} já existe no banco...`);
        const usuarioExiste = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (usuarioExiste) {
            console.log(`[Cadastro] Falha: O e-mail ${email} já está em uso por outro usuário.`);
            return res.status(400).json({ erro: "Este e-mail já está em uso." });
        }

        console.log("[Cadastro] Criptografando a senha...");
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        console.log(`[Cadastro] Inserindo o usuário ${email} no banco de dados...`);
        await db.run('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senhaCriptografada]);

        console.log(`[Cadastro] Sucesso! Usuário ${email} cadastrado perfeitamente.`);
        res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
    } catch (erro) {
        console.error("[Cadastro] ERRO CRÍTICO no servidor:", erro);
        res.status(500).json({ erro: "Erro interno ao cadastrar usuário." });
    }
};

export const login = async (req, res) => {
    const { email, senha } = req.body;

    console.log(`\n[Login] Nova tentativa de login recebida para: ${email}`);

    // --- INÍCIO DAS VALIDAÇÕES ---
    if (!email || !senha) {
        console.log("[Login] Falha: E-mail ou senha não foram enviados na requisição.");
        return res.status(400).json({ erro: "E-mail e senha são obrigatórios para o login." });
    }
    // --- FIM DAS VALIDAÇÕES ---

    try {
        const db = await openDb();

        console.log(`[Login] Buscando usuário ${email} no banco de dados...`);
        const usuario = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (!usuario) {
            console.log(`[Login] Falha: Usuário ${email} não existe no banco de dados.`);
            return res.status(400).json({ erro: "E-mail ou senha incorretos." });
        }

        console.log(`[Login] Usuário encontrado. Verificando a senha...`);
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) {
            console.log(`[Login] Falha: A senha digitada para ${email} está incorreta.`);
            return res.status(400).json({ erro: "E-mail ou senha incorretos." });
        }

        console.log(`[Login] Senha correta. Gerando Token JWT...`);
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        console.log(`[Login] Sucesso! Token gerado para o usuário ID ${usuario.id}. Respondendo ao frontend...`);
        res.json({ 
            mensagem: "Login realizado com sucesso!",
            token: token,
            usuario: { nome: usuario.nome, email: usuario.email }
        });
    } catch (erro) {
        console.error("[Login] ERRO CRÍTICO no servidor:", erro);
        res.status(500).json({ erro: "Erro interno ao fazer login." });
    }
};