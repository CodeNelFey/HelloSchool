import { useState } from 'react';
import { pause, settings, stop, play } from '../assets/svg';
import SettingsModal from './SettingsModal';

function Timer({
                   workDuration,
                    setWorkDuration,
                   breakDuration,
                    setBreakDuration,
                   cycleCount,
                    setCycleCount,
                   time,
                   isRunning,
                   currentCycle,
                   isWorkPhase,
                   startTimer,
                   stopTimer,
                   resetTimer
               }: {
    workDuration: number;
    setWorkDuration: React.Dispatch<React.SetStateAction<number>>;
    breakDuration: number;
    setBreakDuration: React.Dispatch<React.SetStateAction<number>>;
    cycleCount: number;
    setCycleCount: React.Dispatch<React.SetStateAction<number>>;
    time: number;
    setTime: React.Dispatch<React.SetStateAction<number>>;
    isRunning: boolean;
    setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
    currentCycle: number;
    setCurrentCycle: React.Dispatch<React.SetStateAction<number>>;
    isWorkPhase: boolean;
    setIsWorkPhase: React.Dispatch<React.SetStateAction<boolean>>;
    startTimer: () => void;
    stopTimer: () => void;
    resetTimer: () => void;
}) {



    const [circleSize] = useState(100);
    const [isModalOpen, setIsModalOpen] = useState(false);



    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Avancement graphique
    const circleRadius = circleSize;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const initialDuration = isWorkPhase ? workDuration : breakDuration;
    const progress = isWorkPhase ? (1 - (initialDuration - time) / initialDuration) * circleCircumference : (initialDuration - time) / initialDuration * circleCircumference;

    return (
        <div>
            <div className={isModalOpen ? 'blurred' : ''}>
                <div className="timer">
                    {isWorkPhase ? <h2>Il est temps de <span>Travailler</span> !</h2> : <h2>Tu as bien mérité une petite <span>Pause</span> ;)</h2>}
                    <div className="cycle-indicators">
                        {Array.from({ length: cycleCount }).map((_, index) => (
                            <div
                                key={index}
                                className="cycle-indicator"
                                style={{
                                    backgroundColor: index <= currentCycle
                                        ? 'var(--primary-color)'
                                        : 'var(--primary-color-alpha)'
                                }}
                            />
                        ))}
                    </div>
                    <svg
                        width={circleSize * 2 + 20}
                        height={circleSize * 2 + 20}
                        className="timer-circle"
                    >
                        <circle
                            cx={circleSize + 10}
                            cy={circleSize + 10}
                            r={circleRadius}
                            stroke="var(--primary-color-alpha)"
                            strokeWidth={circleSize / 5}
                            fill={time === 0 ? "var(--primary-color)" : "none"}
                        />
                        <circle
                            cx={circleSize + 10}
                            cy={circleSize + 10}
                            r={circleRadius}
                            stroke="var(--primary-color)"
                            strokeWidth={circleSize / 5}
                            fill={time <= 9 ? "var(--primary-color)" : "none"}
                            strokeDasharray={circleCircumference}
                            strokeDashoffset={progress}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                        />
                        {time < 10 && time > 0 && (
                            <text
                                x={circleSize + 10}
                                y={circleSize + 10}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={circleSize}
                                fill="var(--light-color)"
                                fontWeight="bold"
                                transform={`rotate(90, ${circleSize + 10}, ${circleSize + 10})`}
                            >
                                {time}
                            </text>

                        )}
                    </svg>
                    <p>{Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}</p>
                    <div className="timer-controls">
                        <button onClick={isRunning ? stopTimer : startTimer} disabled={time === 0}>
                            {isRunning
                                ? pause({ size: 30, color: "var(--light-color)" })
                                : play({ size: 30, color: "var(--light-color)" })}
                        </button>
                        <button onClick={resetTimer}>
                            {stop({ size: 30, color: "var(--light-color)" })}
                        </button>
                        <button onClick={openModal}>
                            {settings({ size: 30, color: "var(--light-color)" })}
                        </button>
                    </div>
                </div>
            </div>
            <SettingsModal
                isOpen={isModalOpen}
                onClose={closeModal}
                workDuration={workDuration}
                setWorkDuration={setWorkDuration}
                breakDuration={breakDuration}
                setBreakDuration={setBreakDuration}
                cycleCount={cycleCount}
                setCycleCount={setCycleCount}
            />
        </div>
    );
}

export default Timer;
