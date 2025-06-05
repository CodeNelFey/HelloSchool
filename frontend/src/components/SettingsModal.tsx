import React from 'react';
import { cross } from '../assets/svg';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    workDuration: number;
    setWorkDuration: (value: number) => void;
    breakDuration: number;
    setBreakDuration: (value: number) => void;
    cycleCount: number;
    setCycleCount: (value: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         workDuration,
                                                         setWorkDuration,
                                                         breakDuration,
                                                         setBreakDuration,
                                                         cycleCount,
                                                         setCycleCount
                                                     }) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Paramètres</h3>
                <button className="close" onClick={onClose}>
                    {cross({ size: 30, color: "var(--dark-color)" })}
                </button>

                <p>Cycles de travail :</p>
                <div className="cycle-selector">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <div
                            key={index}
                            className="cycle-circle"
                            style={{
                                backgroundColor: index < cycleCount
                                    ? 'var(--primary-color)'
                                    : 'var(--primary-color-alpha)',
                                color: index < cycleCount
                                    ? 'var(--light-color)'
                                    : 'var(--primary-color)'
                            }}
                            onClick={() => setCycleCount(index + 1)}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>

                <p>Temps de travail :</p>
                <div className="time-inputs">
                    <input
                        type="number"
                        min="0"
                        max="60"
                        value={Math.floor(workDuration / 60)}
                        onChange={(e) => {
                            const minutes = Number(e.target.value);
                            const seconds = workDuration % 60;
                            if (minutes === 0 && seconds === 0) {
                                setWorkDuration(1);
                            } else {
                                setWorkDuration((minutes * 60) + seconds);
                            }
                        }}
                        onWheel={(e) => {
                            e.preventDefault();
                            const delta = e.deltaY < 0 ? 1 : -1;
                            const newMinutes = Math.min(60, Math.max(0, Math.floor(workDuration / 60) + delta));
                            const seconds = workDuration % 60;
                            if (newMinutes === 0 && seconds === 0) {
                                setWorkDuration(1);
                            } else {
                                setWorkDuration((newMinutes * 60) + seconds);
                            }
                        }}
                        placeholder="Minutes"
                    />
                    <p className="timeSeparator">:</p>
                    <input
                        type="number"
                        min={Math.floor(workDuration / 60) > 0 ? 0 : 1}
                        max="59"
                        value={workDuration % 60}
                        onChange={(e) => {
                            const seconds = Number(e.target.value);
                            const minutes = Math.floor(workDuration / 60);
                            setWorkDuration((minutes * 60) + seconds);
                        }}
                        onWheel={(e) => {
                            e.preventDefault();
                            const delta = e.deltaY < 0 ? 1 : -1;
                            const currentSeconds = workDuration % 60;
                            const newSeconds = Math.min(
                                59,
                                Math.max(Math.floor(workDuration / 60) > 0 ? 0 : 1, currentSeconds + delta)
                            );
                            setWorkDuration((Math.floor(workDuration / 60) * 60) + newSeconds);
                        }}
                        placeholder="Secondes"
                    />
                </div>

                <p>Temps de pause :</p>
                <div className="time-inputs">
                    <input
                        type="number"
                        min="0"
                        max="60"
                        value={Math.floor(breakDuration / 60)}
                        onChange={(e) => {
                            const minutes = Number(e.target.value);
                            const seconds = breakDuration % 60;
                            if (minutes === 0 && seconds === 0) {
                                setBreakDuration(1);
                            } else {
                                setBreakDuration((minutes * 60) + seconds);
                            }
                        }}
                        onWheel={(e) => {
                            e.preventDefault();
                            const delta = e.deltaY < 0 ? 1 : -1;
                            const newMinutes = Math.min(60, Math.max(0, Math.floor(breakDuration / 60) + delta));
                            const seconds = breakDuration % 60;
                            if (newMinutes === 0 && seconds === 0) {
                                setBreakDuration(1);
                            } else {
                                setBreakDuration((newMinutes * 60) + seconds);
                            }
                        }}
                        placeholder="Minutes"
                    />
                    <p className="timeSeparator">:</p>
                    <input
                        type="number"
                        min={Math.floor(breakDuration / 60) > 0 ? 0 : 1}
                        max="59"
                        value={breakDuration % 60}
                        onChange={(e) => {
                            const seconds = Number(e.target.value);
                            const minutes = Math.floor(breakDuration / 60);
                            setBreakDuration((minutes * 60) + seconds);
                        }}
                        onWheel={(e) => {
                            e.preventDefault();
                            const delta = e.deltaY < 0 ? 1 : -1;
                            const currentSeconds = breakDuration % 60;
                            const newSeconds = Math.min(
                                59,
                                Math.max(Math.floor(breakDuration / 60) > 0 ? 0 : 1, currentSeconds + delta)
                            );
                            setBreakDuration((Math.floor(breakDuration / 60) * 60) + newSeconds);
                        }}
                        placeholder="Secondes"
                    />
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;