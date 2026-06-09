import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ erro: "Acesso negado. Token não fornecido ou mal formatado." });
    }

    const token = authHeader.split(' ')[1];

    try {
    
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);
        
        req.usuarioId = decodificado.id; 
        
        next(); 
    } catch (erro) {
        return res.status(403).json({ erro: "Token inválido ou expirado. Faça login novamente." });
    }
};