// conversations.ts
import { getUserById, type User } from './account';

const API_BASE = 'http://localhost:5000/api';

export type Participant = User

export interface Conversation {
    id: number;
    name: string | null;
    is_group: boolean;
    created_at: string;
    participantIds: number[];        // IDs bruts (ex: [1,2])
    participants?: Participant[];   // Données utilisateurs enrichies
}

export interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    content: string;
    created_at: string;
    sender?: User;
}

/**
 * Récupère les conversations d’un utilisateur donné,
 * et enrichit chaque conversation avec les données des participants.
 */
export async function getUserConversations(userId: number): Promise<Conversation[]> {
    try {
        const res = await fetch(`${API_BASE}/conversations/user/${userId}`);
        if (!res.ok) throw new Error('Erreur récupération conversations');

        console.log(res.body)
        // Format attendu : liste de conversations, chaque conversation contient participants (id seulement)
        const conversationsRaw: Conversation[] = await res.json();

        // Pour chaque conversation, récupérer les infos des participants
        const conversations: Conversation[] = await Promise.all(
            conversationsRaw.map(async (conv) => {
                const participantIds: number[] = conv.participantIds || conv.participantIds || []; // ou une autre clé selon ton API

                // Si ton backend ne renvoie pas les participants dans la conversation,
                // il faut faire un appel dédié. Sinon adapte ici.
                const participants: Participant[] = await Promise.all(
                    participantIds.map(id => getUserById(id.toString()))
                ).then(users => users.filter(u => u !== null) as Participant[]);

                return {
                    ...conv,
                    participantIds,
                    participants,
                };
            })
        );

        return conversations;
    } catch (error) {
        console.error('Erreur dans getUserConversations:', error);
        return [];
    }
}

/**
 * Récupère les messages d’une conversation.
 * Enrichit chaque message avec les infos de son auteur.
 */
export async function getMessages(conversationId: number): Promise<Message[]> {
    try {
        const res = await fetch(`${API_BASE}/messages/${conversationId}`);
        if (!res.ok) throw new Error('Erreur récupération messages');

        const messagesRaw: Message[] = await res.json();

        // Enrichir avec les données des auteurs
        const messages: Message[] = await Promise.all(
            messagesRaw.map(async (msg) => {
                const sender = await getUserById(msg.sender_id.toString());
                return { ...msg, sender: sender || undefined };
            })
        );

        return messages;
    } catch (error) {
        console.error('Erreur dans getMessages:', error);
        return [];
    }
}

/**
 * Envoie un message dans une conversation.
 * @param conversationId ID de la conversation
 * @param senderId ID de l’expéditeur
 * @param content Contenu du message
 * @returns Le message créé (avec ID, timestamp, etc)
 */
export async function sendMessage(
    conversationId: number,
    senderId: number,
    content: string
): Promise<Message | null> {
    try {
        const res = await fetch(`${API_BASE}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conversationId, senderId, content }),
        });
        if (!res.ok) throw new Error('Erreur envoi message');

        const message: Message = await res.json();
        return message;
    } catch (error) {
        console.error('Erreur dans sendMessage:', error);
        return null;
    }
}

export async function createOrGetConversation(userId1: number, userId2: number): Promise<Conversation> {
    try {
        const res = await fetch(`${API_BASE}/conversations/create`, {
            method: 'POST',
            body: JSON.stringify({ userIds: [userId1, userId2] }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error('Erreur création ou récupération conversation');
        }

        const conversation: Conversation = await res.json();
        return conversation;

    } catch (error) {
        console.error("Erreur dans createOrGetConversation:", error);
        throw error;
    }
}

export async function leaveConversation(userId: number, conversationId: number): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE}/conversations/leaveConv/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, conversationId }),
        });

        if (!response.ok) {
            throw new Error(`Erreur serveur : ${response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error("Erreur lors de la tentative de quitter la conversation:", error);
        return false;
    }
}

