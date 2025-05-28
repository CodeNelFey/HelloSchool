import React from 'react';

interface LittleTimerProps {
    time: number;
    initialDuration: number;
    isWorkPhase?: boolean;
    onNavClick: () => void;
    isRunning?: boolean;
    content?: string;
}

const LittleTimer: React.FC<LittleTimerProps> = ({ time, initialDuration, isWorkPhase, onNavClick, isRunning, content }) => {
    const circleSize = 30;
    const circleRadius = circleSize;
    const circleCircumference = 2 * Math.PI * circleRadius;

    const progress = isWorkPhase ? (1 - (initialDuration - time) / initialDuration) * circleCircumference : (initialDuration - time) / initialDuration * circleCircumference;

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return (
        <div
            className="littleTimer"
             onClick={onNavClick}
            style={ isRunning && content != 'timer' ? { right: '20px' } : {right: '-170px'} }
        >
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
                {time < 10 && time > 0 ? (
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
                ) : (
                    <text
                        x={circleSize + 10}
                        y={circleSize + 10}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={circleSize / 2}
                        fill="var(--primary-color)"
                        fontWeight="bold"
                        transform={`rotate(90, ${circleSize + 10}, ${circleSize + 10})`}
                    >
                        {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
                    </text>
                )}
            </svg>
            <div className="text">
                <p>{isWorkPhase ? 'Travail' : 'Pause'}</p>
            </div>

        </div>
    );
};

export default LittleTimer;
