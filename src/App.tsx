import { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Login from "./components/Login.tsx";

function App() {
    const [content, setContent] = useState('home');
    const [fade, setFade] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleContentChange = (newContent: string) => {
        if (newContent !== content) {
            setFade(true);
            setTimeout(() => {
                setContent(newContent);
                setFade(false);
            }, 300);
        }
    };

    return (
        <>
            <div className="shadow"></div>
            <div className={`backboard ${isModalOpen ? 'blurred' : ''}`}>
                <NavBar onNavClick={handleContentChange} onLoginClick={() => setIsModalOpen(true)} />
                <div className={`container ${fade ? 'fade-out' : 'fade-in'}`}>
                    {content === 'home' ? <h1>HelloSchool</h1> : <h1>{content}</h1>}
                </div>
            </div>
            {isModalOpen && <Login setIsModalOpen={setIsModalOpen} />}
        </>
    );
}

export default App;