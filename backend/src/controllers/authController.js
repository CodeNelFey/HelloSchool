import { pool } from '../db/pool.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import jwt from 'jsonwebtoken';

function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

export async function signup(req, res) {
    console.log('--- Requête signup reçue ---');
    console.log('Payload:', req.body);

    const { nom, prenom, email, password, birthdate } = req.body;

    if (!nom || !prenom || !email || !password || !birthdate) {
        console.error('Erreur: champs manquants');
        return res.status(400).json({ message: 'Champs manquants' });
    }

    if (!isValidDate(birthdate)) {
        console.error('Erreur: date invalide:', birthdate);
        return res.status(400).json({ message: 'Date de naissance invalide. Format attendu : YYYY-MM-DD' });
    }

    try {
        console.log('Vérification existence email:', email);
        const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            console.warn('Email déjà utilisé:', email);
            return res.status(409).json({ message: 'Email déjà utilisé' });
        }

        console.log('Hashage du mot de passe');
        const hashedPwd = await hashPassword(password);

        console.log('Insertion utilisateur dans la DB');
        const [result] = await pool.query(
            'INSERT INTO users (firstname, lastname, email, password, birthdate) VALUES (?, ?, ?, ?, ?)',
            [nom, prenom, email, hashedPwd, birthdate]
        );

        console.log('Utilisateur créé avec l\'ID:', result.insertId);
        return res.status(201).json({ message: 'Utilisateur créé', userId: result.insertId });
    } catch (error) {
        console.error('Erreur interne signup:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
}

export async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    try {
        // Chercher l'utilisateur dans la BD
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        const user = rows[0];

        // Comparer le mot de passe envoyé avec celui stocké (hashé)
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        // Générer un token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Répondre avec token et infos utiles
        return res.status(200).json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
}
