import { useState } from 'react';
import type { Flashcard } from '../db/flashcards';

interface Props {
    cards: Flashcard[];
}

export default function FlashcardGame({ cards }: Props) {
    const [index, setIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    if (cards.length === 0) return <p className="voidGroup">Ce groupe est vide.</p>;

    const card = cards[index];

    return (
        <div className="gameMode">
            <button
                className="before"
                onClick={() => {
                    setShowAnswer(false);
                    setIndex((index - 1 + cards.length) % cards.length);
                }}
            >
                {"<"}
            </button>
            <div className="flashcard-container" onClick={() => setShowAnswer(!showAnswer)}>
                <div className={`flashcard ${showAnswer ? 'flipped' : ''}`}>
                    <div className="front">
                        <div className="backgroundText">
                            QUESTIONQUESTIONQUESTION <br/>
                            TIONQUESTIONQUESTIONQUES <br/>
                            QUESTIONQUESTIONQUESTION <br/>
                            TIONQUESTIONQUESTIONQUES <br/>
                            QUESTIONQUESTIONQUESTION <br/>
                            TIONQUESTIONQUESTIONQUES <br/>
                            QUESTIONQUESTIONQUESTION <br/>
                            TIONQUESTIONQUESTIONQUES <br/>
                            QUESTIONQUESTIONQUESTION <br/>
                            TIONQUESTIONQUESTIONQUES <br/>
                        </div>
                        <p>{card.question}</p>
                    </div>
                    <div className="back">
                        <div className="backgroundText">
                            REPONSEREPONSEREPONSE <br/>
                            ONSEREPONSEREPONSEREP <br/>
                            REPONSEREPONSEREPONSE <br/>
                            ONSEREPONSEREPONSEREP <br/>
                            REPONSEREPONSEREPONSE <br/>
                            ONSEREPONSEREPONSEREP <br/>
                            REPONSEREPONSEREPONSE <br/>
                            ONSEREPONSEREPONSEREP <br/>
                            REPONSEREPONSEREPONSE <br/>
                            ONSEREPONSEREPONSEREP <br/>
                        </div>
                        <p>{card.answer}</p>
                    </div>
                </div>
            </div>

            <button
                className="after"
                onClick={() => {
                    setShowAnswer(false);
                    setIndex((index + 1) % cards.length);
                }}
            >
                {">"}
            </button>
        </div>
    );
}
