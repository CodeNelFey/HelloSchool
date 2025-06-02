import {logo} from '../assets/svg';
import tinycolor from 'tinycolor2';

function NavBar({ onNavClick, onLoginClick }: { onNavClick: (section: string) => void, onLoginClick: () => void }) {

    const changeTheme = (color: string, light: boolean) => {
        document.documentElement.style.setProperty('--primary-color', color);
        document.documentElement.style.setProperty('--primary-color-alpha', `${color}20`);
        document.documentElement.style.setProperty('--light-color', light ? tinycolor(color).lighten(45).toString() : tinycolor(color).darken(45).toString());
        document.documentElement.style.setProperty('--dark-color', light ? tinycolor(color).darken(45).toString() : tinycolor(color).lighten(45).toString());
    }

    return (
        <div className="navbar">
            <a href="#" onClick={() => onNavClick('home')}>{ logo({ color: "var(--primary-color)" }) }</a>
            <ul>
                <li><a href="#" onClick={() => onNavClick('cours')}>Cours</a></li>
                <li><a href="#" onClick={() => onNavClick('exercices')}>Exercices</a></li>
                <li><a href="#" onClick={() => onNavClick('timer')}>Timer</a></li>
                <li><a href="#" onClick={() => onNavClick('aide')}>Aide</a></li>
                <li><a href="#" onClick={() => onNavClick('propos')}>A propos</a></li>
            </ul>
            <div className="right">
                <div className="color-picker">
                    <div className="main-circle"></div>
                    <div className="color-menu">
                        <div
                            className="color-circle orange"
                            onClick={() => changeTheme('#ff9100', true)}
                        ></div>
                        <div
                            className="color-circle blue"
                            onClick={() => changeTheme('#007bff', true)}
                        ></div>
                        <div
                            className="color-circle green"
                            onClick={() => changeTheme('#28a745', true)}
                        ></div>
                        <div
                            className="color-circle red"
                            onClick={() => changeTheme('#dc3545', true)}
                        ></div>
                        <div
                            className="color-circle darkorange"
                            onClick={() => changeTheme('#ff9100', false)}
                        ></div>
                        <div
                            className="color-circle darkblue"
                            onClick={() => changeTheme('#007bff', false)}
                        ></div>
                        <div
                            className="color-circle darkgreen"
                            onClick={() => changeTheme('#28a745', false)}
                        ></div>
                        <div
                            className="color-circle darkred"
                            onClick={() => changeTheme('#dc3545', false)}
                        ></div>
                    </div>
                </div>
                <button onClick={onLoginClick}>Se connecter</button>
            </div>
        </div>
    );
}

export default NavBar;