import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import {pool} from './pool.js'

dotenv.config();

// Crée un pool de connexions MySQL/MariaDB

export async function getUserById(userId) {
    try {
        const query = 'SELECT id, firstname, lastname, email FROM users WHERE id = ?';
        const [rows] = await pool.execute(query, [userId]);

        if (rows.length === 0) {
            return null; // utilisateur non trouvé
        }

        const user = rows[0];

        return {
            id: user.id,
            firstName: user.firstname,
            lastName: user.lastname,
            email: user.email,
        };
    } catch (error) {
        console.error('Erreur getUserById:', error);
        throw error;
    }
}
