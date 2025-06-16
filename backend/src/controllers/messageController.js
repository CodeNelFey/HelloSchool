import { pool } from '../db/pool.js';
import { io } from '../app.js'; // importer io

export const sendMessage = async (req, res) => {
    const { senderId, conversationId, content, recipientId } = req.body;

    if (!senderId || !content || (!conversationId && !recipientId)) {
        return res.status(400).json({ message: "Champs manquants" });
    }

    try {
        let convId = conversationId;

        // Si pas de conversationId fourni, on cherche ou crée une conversation entre sender et recipient
        if (!convId) {
            // Recherche conversation existante avec exactement ces deux participants
            const [existingConversations] = await pool.query(`
                SELECT conversation_id
                FROM conversation_participants
                GROUP BY conversation_id
                HAVING 
                    COUNT(*) = 2 AND
                    SUM(user_id NOT IN (?, ?)) = 0 AND
                    SUM(user_id IN (?, ?)) = 2
            `, [senderId, recipientId, senderId, recipientId]);

            if (existingConversations.length > 0) {
                convId = existingConversations[0].conversation_id;
            } else {
                // Créer une nouvelle conversation
                const [result] = await pool.query(
                    'INSERT INTO conversations (name, is_group) VALUES (?, ?)',
                    [null, false]
                );
                convId = result.insertId;

                // Ajouter participants
                await pool.query(
                    'INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?), (?, ?)',
                    [convId, senderId, convId, recipientId]
                );
            }
        }

        // Insérer le message dans la conversation (existante ou nouvellement créée)
        const [result] = await pool.query(
            'INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)',
            [convId, senderId, content]
        );

        // Récupérer le message complet avec infos utilisateur
        const [rows] = await pool.query(
            `SELECT m.id, m.content, m.created_at, u.id AS sender_id, u.firstname, u.lastname
             FROM messages m
                      JOIN users u ON m.sender_id = u.id
             WHERE m.id = ?`,
            [result.insertId]
        );
        const newMessage = rows[0];

        // Émettre l’événement aux clients dans la room de la conversation
        io.to(`conversation_${convId}`).emit('newMessage', newMessage);

        res.status(201).json({
            message: "Message envoyé",
            conversationId: convId,
            messageId: result.insertId,
            newMessage
        });
    } catch (error) {
        console.error('Erreur lors de l’envoi du message:', error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};


export const getMessagesByConversation = async (req, res) => {
    const { conversationId } = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT m.id, m.content, m.created_at, u.id AS sender_id, u.firstname, u.lastname
             FROM messages m
             JOIN users u ON m.sender_id = u.id
             WHERE m.conversation_id = ?
             ORDER BY m.created_at ASC`,
            [conversationId]
        );

        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
