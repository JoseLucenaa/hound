import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    console.log(`\n[Middleware JWT] Interceptando requisição para rota protegida...`);
    
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("[Middleware JWT] Falha: Cabeçalho 'Authorization' ausente ou não começa com 'Bearer '.");
        return res.status(401).json({ erro: "Acesso negado. Token não fornecido ou mal formatado." });
    }

    const token = authHeader.split(' ')[1];
    console.log(`[Middleware JWT] Token recebido do frontend: ${token.substring(0, 15)}... (truncado)`);

    try {
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log(`[Middleware JWT] Sucesso! Token validado. Usuário ID: ${decodificado.id}. Liberando rota.`);
        req.usuarioId = decodificado.id; 
        
        next(); 
    } catch (erro) {
        console.log(`[Middleware JWT] Falha na verificação do Token: ${erro.message}`);
        return res.status(403).json({ erro: "Token inválido ou expirado. Faça login novamente." });
    }
};