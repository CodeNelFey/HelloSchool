import { useState } from 'react';

export default function Flashcard({ card }: { card: { question: string; answer: string } }) {
    const [flipped, setFlipped] = useState(false);

    return (
        <div className="flashcard-container" onClick={() => setFlipped(!flipped)}>
            <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
                <div className="front">
                    <strong>Question :</strong>
                    <p>{card.question}</p>
                </div>
                <div className="back">
                    <strong>Réponse :</strong>
                    <p>{card.answer}</p>
                </div>
            </div>
        </div>
    );
}
