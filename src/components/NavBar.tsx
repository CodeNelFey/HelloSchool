import logo from '../assets/react.svg';

function NavBar({ onNavClick, onLoginClick }: { onNavClick: (section: string) => void, onLoginClick: () => void }) {
    return (
        <div className="navbar">
            <a href="#" onClick={() => onNavClick('home')}><img src={logo} alt="Logo" /></a>
            <ul>
                <li><a href="#" onClick={() => onNavClick('cours')}>Cours</a></li>
                <li><a href="#" onClick={() => onNavClick('exercices')}>Exercices</a></li>
                <li><a href="#" onClick={() => onNavClick('timer')}>Timer</a></li>
                <li><a href="#" onClick={() => onNavClick('aide')}>Aide</a></li>
                <li><a href="#" onClick={() => onNavClick('propos')}>A propos</a></li>
            </ul>
            <div className="color-picker">
                <div className="main-circle"></div>
                <div className="color-menu">
                    <div
                        className="color-circle orange"
                        onClick={() => document.documentElement.style.setProperty('--primary-color', '#ff6a00')}
                    ></div>
                    <div
                        className="color-circle blue"
                        onClick={() => document.documentElement.style.setProperty('--primary-color', '#007bff')}
                    ></div>
                    <div
                        className="color-circle green"
                        onClick={() => document.documentElement.style.setProperty('--primary-color', '#28a745')}
                    ></div>
                    <div
                        className="color-circle red"
                        onClick={() => document.documentElement.style.setProperty('--primary-color', '#dc3545')}
                    ></div>
                </div>
            </div>
            <button onClick={onLoginClick}>Se connecter</button>
        </div>
    );
}

export default NavBar;