import { useState, useEffect, useRef } from 'react';
import NavBar from './components/NavBar';
import Login from "./components/Login.tsx";
import Timer from "./components/Timer.tsx";
import LittleTimer from "./components/LittleTimer.tsx";

function App() {
    const [content, setContent] = useState('home');
    const [fade, setFade] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // TIMER STATES
    const [workDuration, setWorkDuration] = useState(10);
    const [breakDuration, setBreakDuration] = useState(15);
    const [cycleCount, setCycleCount] = useState(3);
    const [time, setTime] = useState(workDuration);
    const [isRunning, setIsRunning] = useState(false);
    const [currentCycle, setCurrentCycle] = useState(0);
    const [isWorkPhase, setIsWorkPhase] = useState(true);
    const intervalRef = useRef<number | null>(null);

    const initialDuration = isWorkPhase ? workDuration : breakDuration;

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const shadow = document.querySelector('.shadow') as HTMLElement;
            const { clientX, clientY } = event;
            const { innerWidth, innerHeight } = window;

            const oppositeX = (innerWidth - clientX) / innerWidth * 100;
            const oppositeY = (innerHeight - clientY) / innerHeight * 100;

            shadow.style.left = `${oppositeX}%`;
            shadow.style.top = `${oppositeY}%`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        setTime(isWorkPhase ? workDuration : breakDuration);
    }, [workDuration, breakDuration, isWorkPhase]);

    useEffect(() => {
        if (time === 0 && !isRunning) {
            if (isWorkPhase) {
                setIsWorkPhase(false);
                setTime(breakDuration);
                setTimeout(() => startTimer(), 100);
            } else {
                const nextCycle = currentCycle + 1;
                if (nextCycle >= cycleCount) {
                    setCurrentCycle(0);
                    setIsWorkPhase(true);
                    setTime(workDuration);
                } else {
                    setCurrentCycle(nextCycle);
                    setIsWorkPhase(true);
                    setTime(workDuration);
                    setTimeout(() => startTimer(), 100);
                }
            }
        }
    }, [time, isRunning]);

    const startTimer = () => {
        if (!isRunning) {
            setIsRunning(true);
            intervalRef.current = window.setInterval(() => {
                setTime((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(intervalRef.current!);
                        intervalRef.current = null;
                        setIsRunning(false);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
    };

    const stopTimer = () => {
        if (isRunning) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            setIsRunning(false);
        }
    };

    const resetTimer = () => {
        stopTimer();
        setCurrentCycle(0);
        setIsWorkPhase(true);
        setTime(workDuration);
    };

    const handleContentChange = (newContent: string) => {
        if (newContent !== content) {
            setFade(true);
            setTimeout(() => {
                setContent(newContent);
                setFade(false);
            }, 300);
        }
    };

    const renderContent = () => {
        switch (content) {
            case 'home':
                return <h1>HelloSchool</h1>;
            case 'cours':
                return <h1>Bienvenue dans les cours</h1>;
            case 'exercices':
                return <h1>Bienvenue dans les exercices</h1>;
            case 'timer':
                return <Timer
                    workDuration={workDuration}
                    setWorkDuration={setWorkDuration}
                    breakDuration={breakDuration}
                    setBreakDuration={setBreakDuration}
                    cycleCount={cycleCount}
                    setCycleCount={setCycleCount}
                    time={time}
                    setTime={setTime}
                    isRunning={isRunning}
                    setIsRunning={setIsRunning}
                    currentCycle={currentCycle}
                    setCurrentCycle={setCurrentCycle}
                    isWorkPhase={isWorkPhase}
                    setIsWorkPhase={setIsWorkPhase}
                    startTimer={startTimer}
                    stopTimer={stopTimer}
                    resetTimer={resetTimer}
                />;
            case 'aide':
                return <h1>Bienvenue dans l'aide</h1>;
            case 'propos':
                return <h1>Bienvenue dans la section à propos</h1>;
            default:
                return <h1>Contenu non trouvé</h1>;
        }
    };

    return (
        <>
            <div className="shadow"></div>
            <div className={`backboard ${isModalOpen ? 'blurred' : ''}`}>
                <NavBar onNavClick={handleContentChange} onLoginClick={() => setIsModalOpen(true)} />
                <div className={`container ${fade ? 'fade-out' : 'fade-in'}`}>
                    {renderContent()}
                </div>
                <LittleTimer
                    time={time}
                    initialDuration={initialDuration}
                    isWorkPhase={isWorkPhase}
                    onNavClick={() => handleContentChange('timer')}
                    isRunning={isRunning}
                    content={content}
                />
            </div>
            {isModalOpen && <Login setIsModalOpen={setIsModalOpen} />}
        </>
    );
}

export default App;