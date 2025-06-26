import { useState } from 'react';
import type { Flashcard } from '../db/flashcards'; // adapte selon ta définition

interface FlashcardEditorProps {
    initialCards?: Flashcard[];
    onSave: (cards: Flashcard[], cardsToDelete: Flashcard[]) => Promise<void>;
}

export default function FlashcardEditor({ initialCards, onSave }: FlashcardEditorProps) {
    const [cards, setCards] = useState<Flashcard[]>(initialCards ?? []);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [cardsToDelete, setCardsToDelete] = useState<Flashcard[]>([]);

    const handleDeleteCard = (id: number) => {
        const card = cards.find(c => c.id === id);
        if (!card) return;

        if (card.id > 0) {
            // Carte existante, marquer pour suppression
            setCardsToDelete([...cardsToDelete, card]);
        }
        // Retirer de la liste visible
        setCards(cards.filter(c => c.id !== id));
    };


    // Ajouter une nouvelle carte
    const handleAddCard = () => {
        if (!newQuestion.trim() || !newAnswer.trim()) return;
        setCards([...cards, { id: 0, question: newQuestion, answer: newAnswer }]);
        setNewQuestion('');
        setNewAnswer('');
    };

    // Modifier une carte existante (question ou answer)
    const handleChangeCard = (id: number, field: 'question' | 'answer', value: string) => {
        setCards(cards.map(card => card.id === id ? { ...card, [field]: value } : card));
    };


    // Sauvegarder via la fonction passée en props
    const handleSave = async () => {
        await onSave(cards, cardsToDelete);
        setCardsToDelete([]);
    };

    return (
        <div className="editMode">
            <h3>Édition des cartes</h3>

            <div className="newElement">
                <input
                    className="question"
                    type="text"
                    placeholder="Nouvelle question"
                    value={newQuestion}
                    onChange={e => setNewQuestion(e.target.value)}
                />
                <input
                    className="reponse"
                    type="text"
                    placeholder="Nouvelle réponse"
                    value={newAnswer}
                    onChange={e => setNewAnswer(e.target.value)}
                />
                <button onClick={handleAddCard}>+</button>
            </div>

            <ul>
                {cards.map(card => (
                    <li key={card.id}>
                        <input
                            className="question"
                            type="text"
                            value={card.question}
                            onChange={e => handleChangeCard(card.id, 'question', e.target.value)}
                        />
                        <input
                            className="reponse"
                            type="text"
                            value={card.answer}
                            onChange={e => handleChangeCard(card.id, 'answer', e.target.value)}
                        />
                        <button onClick={() => handleDeleteCard(card.id)}>x</button>
                    </li>
                ))}
            </ul>

            <button className="saveButton" onClick={handleSave}>Sauvegarder les modifications</button>
        </div>
    );
}
