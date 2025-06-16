import { pool } from '../db/pool.js';

export const createConversation = async (req, res) => {
    console.log('Requête reçue:', req.body);
    console.log("creation de la conversation")

    const participantIds = req.body.userIds;
    const name = req.body.name || null;
    const isGroup = req.body.isGroup || false;

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length < 2) {
        return res.status(400).json({ message: "Au moins deux participants sont requis." });
    }

    try {
        const placeholders = participantIds.map(() => '?').join(',');

        const [existingConversations] = await pool.query(`
            SELECT conversation_id
            FROM conversation_participants
            GROUP BY conversation_id
            HAVING
                COUNT(*) = ? AND
                SUM(user_id NOT IN (${placeholders})) = 0 AND
                SUM(user_id IN (${placeholders})) = ?
        `, [
            participantIds.length,
            ...participantIds,
            ...participantIds,
            participantIds.length
        ]);

        if (existingConversations.length > 0) {
            const conversationId = existingConversations[0].conversation_id;

            // Récupère conversation + participants
            const [[conversation]] = await pool.query(
                'SELECT id, name, is_group FROM conversations WHERE id = ?',
                [conversationId]
            );

            const [participants] = await pool.query(`
                SELECT a.id, a.firstName AS firstName, a.lastName AS lastName
                FROM users a
                JOIN conversation_participants cp ON cp.user_id = a.id
                WHERE cp.conversation_id = ?
            `, [conversationId]);

            return res.status(200).json({
                ...conversation,
                participants,
                messages: [], // si tu veux précharger les derniers messages plus tard
            });
        }

        // Crée la conversation
        const [result] = await pool.query(
            'INSERT INTO conversations (name, is_group) VALUES (?, ?)',
            [name, isGroup]
        );

        const conversationId = result.insertId;

        const values = participantIds.map(userId => [conversationId, userId]);

        await pool.query(
            'INSERT INTO conversation_participants (conversation_id, user_id) VALUES ?',
            [values]
        );

        const [[conversation]] = await pool.query(
            'SELECT id, name, is_group FROM conversations WHERE id = ?',
            [conversationId]
        );

        const [participants] = await pool.query(`
            SELECT a.id, a.firstName AS firstName, a.lastName AS lastName
            FROM users a
                     JOIN conversation_participants cp ON cp.user_id = a.id
            WHERE cp.conversation_id = ?
        `, [conversationId]);

        return res.status(201).json({
            ...conversation,
            participants,
            messages: [],
        });

    } catch (error) {
        console.error('Erreur createConversation:', error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};



export const getUserConversations = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "userId requis en paramètre" });
    }

    try {
        // Étape 1 : Récupérer toutes les conversations de l'utilisateur
        const [rows] = await pool.query(`
            SELECT c.id, c.name, c.is_group, c.created_at
            FROM conversations c
                     JOIN conversation_participants cp ON cp.conversation_id = c.id
            WHERE cp.user_id = ?
            ORDER BY c.created_at DESC
        `, [userId]);

        // Étape 2 : Pour chaque conversation, récupérer les participants
        const conversationsWithParticipants = await Promise.all(rows.map(async (conv) => {
            const [participantsRows] = await pool.query(
                `SELECT user_id FROM conversation_participants WHERE conversation_id = ?`,
                [conv.id]
            );
            const participantIds = participantsRows.map(row => row.user_id);

            return {
                ...conv,
                participantIds
            };
        }));

        res.json(conversationsWithParticipants);
    } catch (error) {
        console.error('Erreur getUserConversations:', error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

export const leaveConversation = async (req, res) => {
    const { userId, conversationId } = req.body;

    if (!userId || !conversationId) {
        return res.status(400).json({ error: 'userId et conversationId sont requis.' });
    }

    try {
        const [result] = await pool.execute(
            'DELETE FROM conversation_participants WHERE user_id = ? AND conversation_id = ?',
            [userId, conversationId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Aucune ligne supprimée. Vérifiez les identifiants.' });
        }

        res.status(200).json({ message: 'Utilisateur retiré de la conversation.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de participant :', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

