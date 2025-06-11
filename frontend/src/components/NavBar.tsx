import {useEffect, useState} from 'react';
import { logo } from '../assets/svg';
import tinycolor from 'tinycolor2';
import { isLoggedIn, getProfileImageUrl, logout } from '../db/account';
import Account from './Account'; // À créer

function NavBar({ onNavClick, onLoginClick }: { onNavClick: (section: string) => void, onLoginClick: () => void }) {
    const [accountPopupVisible, setAccountPopupVisible] = useState(false);
    const [profileImgUrlFetch, setProfileImgUrlFetch] = useState<string>("../../default-profile.png");

    const changeTheme = (color: string, light: boolean) => {
        document.documentElement.style.setProperty('--primary-color', color);
        document.documentElement.style.setProperty('--primary-color-alpha', `${color}20`);
        document.documentElement.style.setProperty('--light-color', light ? tinycolor(color).lighten(45).toString() : tinycolor(color).darken(45).toString());
        document.documentElement.style.setProperty('--dark-color', light ? tinycolor(color).darken(45).toString() : tinycolor(color).lighten(45).toString());
        document.documentElement.style.setProperty('--dark-color-alpha', light ? `${tinycolor(color).darken(45).toString()}50` : `${tinycolor(color).lighten(45).toString()}70`);
    };

    const loggedIn = isLoggedIn();
    const profileImgUrl = loggedIn ? getProfileImageUrl() : null;

    const toggleAccountPopup = () => {
        console.log("before clic")
        setAccountPopupVisible(!accountPopupVisible);
        console.log("after clic")
    }

    const handleLogout = () => {
        logout(); // ta fonction logout dans account.ts qui nettoie localStorage, cookies, etc.
        setAccountPopupVisible(false);
        // Tu peux aussi forcer un reload ou redirection ici si besoin
    };

    useEffect(() => {
        const fetchProfileImgUrl = async () => {
            const url = await getProfileImageUrl(); // ta fonction async
            setProfileImgUrlFetch(url);
        };

        fetchProfileImgUrl();
    }, []);

    return (
        <div className="navbar">
            <a href="#" onClick={() => onNavClick('home')}>{logo({ color: "var(--primary-color)" })}</a>
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

                {loggedIn && profileImgUrl ? (
                    <>
                        <img
                            src={profileImgUrlFetch}
                            alt="Photo de profil"
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                cursor: "pointer",
                                objectFit: "cover",
                                border: "2px solid var(--primary-color)",
                            }}
                            onClick={toggleAccountPopup}
                        />
                        {accountPopupVisible && (
                            <Account onLogout={handleLogout} />
                        )}
                    </>
                ) : (
                    <button className="loginButton" onClick={onLoginClick}>Se connecter</button>
                )}
            </div>
        </div>
    );
}

export default NavBar;
