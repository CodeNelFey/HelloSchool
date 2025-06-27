import { fetchWithAuth } from './wrapper';

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

// Obtenir les groupes de l'utilisateur
export async function getUserFlashcardGroups(): Promise<FlashcardGroup[]> {
    const res = await fetchWithAuth(`${API_BASE}/flashcards/groups`);
    if (!res.ok) throw new Error('Erreur récupération groupes personnels');
    return await res.json();
}

// Créer un groupe de flashcards
export async function createFlashcardGroup(
    title: string,
    description: string,
    isPublic: boolean,
    flashcards: Flashcard[]
): Promise<{ groupId: number } | null> {
    try {
        const res = await fetchWithAuth(`${API_BASE}/flashcards/group`, {
            method: 'POST',
            body: JSON.stringify({ title, description, isPublic, flashcards }),
        });

        if (!res.ok) throw new Error('Erreur création groupe');
        return await res.json();
    } catch (err) {
        console.error('Erreur createFlashcardGroup:', err);
        return null;
    }
}

// Ajouter des flashcards à un groupe
export async function addFlashcardsToGroup(
    groupId: number,
    flashcards: Flashcard[]
): Promise<boolean> {
    try {
        const res = await fetchWithAuth(`${API_BASE}/flashcards/group/${groupId}/add`, {
            method: 'POST',
            body: JSON.stringify({ flashcards }),
        });

        return res.ok;
    } catch (err) {
        console.error('Erreur addFlashcardsToGroup:', err);
        return false;
    }
}

// Modifier une flashcard
export async function updateFlashcard(
    flashcardId: number,
    question: string,
    answer: string
): Promise<boolean> {
    try {
        const res = await fetchWithAuth(`${API_BASE}/flashcards/edit/${flashcardId}`, {
            method: 'PUT',
            body: JSON.stringify({ question, answer }),
        });

        return res.ok;
    } catch (err) {
        console.error('Erreur updateFlashcard:', err);
        return false;
    }
}

// Modifier le nom d'un groupe
export async function updateGroupName(
    groupId: number,
    name: string
): Promise<boolean> {
    try {
        const res = await fetchWithAuth(`${API_BASE}/flashcards/rename/${groupId}`, {
            method: 'PUT',
            body: JSON.stringify({ name }),
        });

        return res.ok;
    } catch (err) {
        console.error('Erreur updateGroupName:', err);
        return false;
    }
}

// Modifier la visibilité d'un groupe
export async function updateGroupVisibility(
    groupId: number,
    visibility: boolean
): Promise<boolean> {
    try {
        const res = await fetchWithAuth(`${API_BASE}/flashcards/changeVisibility/${groupId}`, {
            method: 'PUT',
            body: JSON.stringify({ visibility }),
        });

        return res.ok;
    } catch (err) {
        console.error('Erreur updateGroupVisibility:', err);
        return false;
    }
}

// Supprimer une flashcard
export async function deleteFlashcard(flashcardId: number): Promise<boolean> {
    try {
        const res = await fetchWithAuth(`${API_BASE}/flashcards/delete/${flashcardId}`, {
            method: 'DELETE',
        });

        return res.ok;
    } catch (err) {
        console.error('Erreur deleteFlashcard:', err);
        return false;
    }
}

// Obtenir un groupe de flashcards par ID
export async function getFlashcardGroupById(groupId: number): Promise<FlashcardGroup> {
    const res = await fetchWithAuth(`${API_BASE}/flashcards/group/${groupId}`);
    if (!res.ok) throw new Error('Erreur récupération groupe');
    return await res.json();
}

// Obtenir les groupes publics
export async function getPublicFlashcardGroups(): Promise<FlashcardGroup[]> {
    const res = await fetch(`${API_BASE}/flashcards/public-groups`);
    if (!res.ok) throw new Error('Erreur récupération groupes publics');
    return await res.json();
}
