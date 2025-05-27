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
            <button onClick={onLoginClick}>Se connecter</button>
        </div>
    );
}

export default NavBar;