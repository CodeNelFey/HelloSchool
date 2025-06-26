import { pool } from '../db/pool.js';

export async function createGroup(req, res) {
    const { title, description, isPublic, flashcards } = req.body;
    const userId = req.user?.userId;

    console.log("creation d'un group")
    if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            'INSERT INTO flashcard_groups (title, description, is_public, user_id) VALUES (?, ?, ?, ?)',
            [title, description, isPublic, userId]
        );

        const groupId = result.insertId;

        for (const card of flashcards) {
            await connection.query(
                'INSERT INTO flashcards (question, answer, group_id) VALUES (?, ?, ?)',
                [card.question, card.answer, groupId]
            );
        }

        await connection.commit();
        res.status(201).json({ groupId });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la création du groupe de flashcards.' });
    } finally {
        connection.release();
    }
}


export async function updateFlashcard(req, res)  {
    const { question, answer } = req.body;
    const flashcardId = req.params.id;

    console.log("maj d'une carte")
    try {
        await pool.query(
            'UPDATE flashcards SET question = ?, answer = ? WHERE id = ?',
            [question, answer, flashcardId]
        );
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la flashcard.' });
    }
};

export async function updateFlashcardName(req, res)  {
    const { name } = req.body;
    const flashcardId = req.params.id;

    console.log("maj du nom d'une carte")
    try {
        await pool.query(
            'UPDATE flashcard_groups SET title = ? WHERE id = ?',
            [name, flashcardId]
        );
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la flashcard.' });
    }
};

export async function deleteFlashcard(req, res)  {
    const flashcardId = req.params.id;

    console.log("supprimer une carte")
    try {
        await pool.query('DELETE FROM flashcards WHERE id = ?', [flashcardId]);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la suppression de la flashcard.' });
    }
};

export async function addFlashcardsToGroup(req, res) {
    const groupId = req.params.id;
    const { flashcards } = req.body;
    const userId = req.user?.userId;
    console.log("ajout de carte dans un group")
    if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    try {
        // Vérifie si le groupe existe et appartient à l'utilisateur
        const [groupRows] = await pool.query(
            'SELECT * FROM flashcard_groups WHERE id = ?',
            [groupId]
        );

        if (groupRows.length === 0) {
            return res.status(404).json({ error: 'Groupe introuvable' });
        }

        const group = groupRows[0];

        if (!group.is_public && group.user_id !== userId) {
            return res.status(403).json({ error: 'Accès interdit à ce groupe privé' });
        }

        // Ajout des flashcards
        for (const card of flashcards) {
            await pool.query(
                'INSERT INTO flashcards (question, answer, group_id) VALUES (?, ?, ?)',
                [card.question, card.answer, groupId]
            );
        }

        res.status(201).json({ message: 'Cartes ajoutées avec succès.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de l’ajout des cartes.' });
    }
}

export async function getUserFlashcardGroups(req, res) {
    const userId = req.user?.userId || req.user?.id;

    console.log("obtenir les groups d'un user")
    if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    try {
        const [groups] = await pool.query(
            'SELECT id, title, description, is_public FROM flashcard_groups WHERE user_id = ?',
            [userId]
        );

        res.json(groups);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur récupération groupes flashcards' });
    }
}

export async function getFlashcardGroupById(req, res) {
    const groupId = req.params.id;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    try {
        // Vérifier accès au groupe (public ou appartenant à l'utilisateur)
        const [groups] = await pool.query(
            'SELECT * FROM flashcard_groups WHERE id = ? AND (is_public = 1 OR user_id = ?)',
            [groupId, userId]
        );

        if (groups.length === 0) {
            return res.status(404).json({ error: 'Groupe introuvable ou accès interdit' });
        }

        const group = groups[0];

        // Récupérer les cartes associées
        const [cards] = await pool.query(
            'SELECT * FROM flashcards WHERE group_id = ?',
            [groupId]
        );

        group.flashcards = cards;

        res.json(group);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération du groupe.' });
    }
}


export async function getPublicFlashcardGroups(req, res) {
    try {
        const [groups] = await pool.query(
            'SELECT id, title, description, is_public, user_id FROM flashcard_groups WHERE is_public = 1'
        );
        res.status(200).json(groups);
    } catch (err) {
        console.error('Erreur récupération groupes publics :', err);
        res.status(500).json({ error: 'Erreur récupération groupes publics' });
    }
}
