const API_BASE = 'http://localhost:5000/api';

export interface Flashcard {
    id: number;
    question: string;
    answer: string;
    group_id?: number;
}

export interface FlashcardGroup {
    id: number;
    title: string;
    description: string;
    is_public: boolean;
    user_id: number;
    flashcards?: Flashcard[];
}

export async function getUserFlashcardGroups(): Promise<FlashcardGroup[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Token manquant");

    const res = await fetch('http://localhost:5000/api/flashcards/groups', {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Erreur récupération groupes');
    const groups = await res.json();
    return groups;
}


/**
 * Crée un groupe de flashcards avec ses cartes
 */
export async function createFlashcardGroup(
    token: string,
    title: string,
    description: string,
    isPublic: boolean,
    flashcards: Flashcard[]
): Promise<{ groupId: number } | null> {
    try {
        const res = await fetch(`${API_BASE}/flashcards/group`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, isPublic, flashcards }),
        });

        if (!res.ok) throw new Error('Erreur création groupe');

        return await res.json();
    } catch (err) {
        console.error('Erreur createFlashcardGroup:', err);
        return null;
    }
}

/**
 * Ajoute des cartes à un groupe de flashcards
 */
export async function addFlashcardsToGroup(
    token: string,
    groupId: number,
    flashcards: Flashcard[]
): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE}/flashcards/group/${groupId}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ flashcards }),
        });

        return res.ok;
    } catch (err) {
        console.error('Erreur addFlashcardsToGroup:', err);
        return false;
    }
}

/**
 * Modifie une flashcard
 */
export async function updateFlashcard(
    token: string,
    flashcardId: number,
    question: string,
    answer: string
): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE}/flashcards/edit/${flashcardId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ question, answer }),
        });

        return res.ok;
    } catch (err) {
        console.error('Erreur updateFlashcard:', err);
        return false;
    }
}


export async function updateGroupName(
    token: string,
    groupId: number,
    name: string
): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE}/flashcards/rename/${groupId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name }),
        });

        return res.ok;
    } catch (err) {
        console.error('Erreur updateFlashcard:', err);
        return false;
    }
}

/**
 * Supprime une flashcard
 */
export async function deleteFlashcard(
    token: string,
    flashcardId: number
): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE}/flashcards/delete/${flashcardId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        return res.ok;
    } catch (err) {
        console.error('Erreur deleteFlashcard:', err);
        return false;
    }
}


export async function getFlashcardGroupById(token: string, groupId: number): Promise<FlashcardGroup> {
    const res = await fetch(`${API_BASE}/flashcards/group/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Erreur récupération groupe');
    return res.json();
}


export async function getPublicFlashcardGroups(): Promise<FlashcardGroup[]> {
    const res = await fetch(`${API_BASE}/flashcards/public-groups`);

    if (!res.ok) throw new Error('Erreur récupération groupes publics');
    return await res.json();
}

