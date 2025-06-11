import path from 'path';
import { fileURLToPath } from 'url';
import { getUserById } from '../db/userModel.js'; // ta fonction pour accéder à la BDD
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getUserImage(req, res) {
    try {
        const userId = req.header('x-user-id'); // ou récupère depuis token/session selon ton auth
        if (!userId) {
            return res.status(401).json({ message: 'User ID manquant' });
        }

        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        if (!user.profileImagePath) {
            return res.sendFile(path.join(__dirname, '../../public/images/default-profile.png'));
        }

        const imagePath = path.join(__dirname, '../../public/images/users', user.profileImagePath);
        return res.sendFile(imagePath);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
}

export async function getUserByIdController(req, res) {
    try {
        const userId = req.params.id;
        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json(user);
    } catch (error) {
        console.error('Erreur dans getUserByIdController:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}


// Dossier de stockage
const uploadDir = path.join(__dirname, '../../public/images/users');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        const userId = req.params.id;
        cb(null, `${userId}.jpg`);
    },
});
export const upload = multer({ storage });

// Contrôleur de l’upload
export async function uploadProfilePicture(req, res) {
    const userId = req.params.id;

    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier reçu' });
    }

    return res.status(200).json({
        message: 'Image de profil uploadée avec succès',
        filename: req.file.filename,
        path: `/profile-pics/${req.file.filename}`
    });
}
