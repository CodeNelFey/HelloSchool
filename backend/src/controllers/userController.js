import path from 'path';
import { fileURLToPath } from 'url';
import { getUserById } from '../db/userModel.js'; // ta fonction pour accéder à la BDD

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