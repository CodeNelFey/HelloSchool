import {useEffect, useState} from 'react';
import {
    addFlashcardsToGroup,
    deleteFlashcard,
    type Flashcard,
    type FlashcardGroup,
    updateFlashcard, updateGroupName
} from '../db/flashcards';
import FlashcardGame from "./FlashcardGame";
import FlashcardEditor from "./FlashcardEditor";
import Notification from './Notification'

interface Props {
    group: FlashcardGroup & { readonly?: boolean };
    onBack: () => void;
    readonly?: boolean;
    onRefresh: () => Promise<void>;
}

export default function FlashcardGroupDetail({ group, onBack, readonly = false, onRefresh }: Props) {
    const [mode, setMode] = useState<'jeu' | 'modif'>('jeu');
    const [cards] = useState<Flashcard[]>(group.flashcards || []);
    const isReadonly = readonly;
    const [newName, setNewName] = useState(group.title)
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    useEffect(() => {
        if (notification) {
            const timeout = setTimeout(() => {
                setNotification(null);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [notification]);
    // Exemple fonction pour modifier une carte (à adapter)
    return (
        <div className="flashcardsGroupDetails">
            <button onClick={onBack} className="backButton">← Retour aux groupes</button>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                />
            )}
            {mode === 'jeu' && (
                <h2>{group.title}</h2>
            )}
            {mode === 'modif' && (
                <input
                    className="titleInput"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
            )}
            {readonly == false && (
                <div className="modeToggle">
                    <div className={`slider ${mode}`} />
                    <button onClick={() => setMode('jeu')} disabled={mode === 'jeu'}>
                        Jouer
                    </button>
                    <button
                        onClick={() => setMode('modif')}
                        disabled={mode === 'modif' || isReadonly}
                    >
                        Modifier
                    </button>
                </div>
            )}

            {mode === 'jeu' && (
                <FlashcardGame cards={cards} />
            )}

            {mode === 'modif' && !isReadonly && (
                <FlashcardEditor
                    initialCards={cards}
                    onSave={async (updatedCards, deletedCards) => {
                        const token = localStorage.getItem('token');
                        if (!token) {
                            setNotification({ message: "Connexion requise pour sauvegarder", type: "error" });
                            return;
                        }

                        // Suppression
                        for (const card of deletedCards) {
                            await deleteFlashcard(token, card.id);
                        }

                        // Mise à jour et ajout
                        const existingCards = updatedCards.filter(card => typeof card.id === 'number' && card.id > 0);
                        const newCards = updatedCards.filter(card => !(typeof card.id === 'number' && card.id > 0));

                        for (const card of existingCards) {
                            await updateFlashcard(token, card.id, card.question, card.answer);
                        }

                        if (newCards.length > 0) {
                            await addFlashcardsToGroup(token, group.id, newCards);
                        }

                        // Changement de nom
                        if (group.title !== newName) {
                            await updateGroupName(token, group.id, newName);
                        }

                        setNotification({ message: "Cartes sauvegardées !", type: "success" });

                        await onRefresh(); // Rafraîchit les données du groupe
                        setMode('jeu');
                    }}
                />
            )}



        </div>
    );
}
