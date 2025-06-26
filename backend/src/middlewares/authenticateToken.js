import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
    console.log(req.headers.authorization)
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Token manquant' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token manquant' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        console.log('JWT_SECRET:', process.env.JWT_SECRET);
        if (err) {
            console.log('Erreur jwt.verify:', err);
            return res.status(403).json({ error: 'Token invalide' });
        }
        console.log('Payload JWT décodé:', user);
        req.user = user;
        next();
    });

}
