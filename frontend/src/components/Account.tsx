import React, { useEffect, useState } from 'react';
import { getEmail, getFullName, getProfileImageUrl } from "../db/account";
import {pen} from "../assets/svg";

interface AccountProps {
    onLogout: () => void;
}

const Account: React.FC<AccountProps> = ({ onLogout }) => {
    const [profileImgUrlFetch, setProfileImgUrlFetch] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    useEffect(() => {
        async function fetchUserData() {
            const [name, mail, imgUrl] = await Promise.all([
                getFullName(),
                getEmail(),
                getProfileImageUrl(),
            ]);

            setFullName(name);
            setEmail(mail);
            setProfileImgUrlFetch(imgUrl);
        }

        fetchUserData();
    }, []);

    return (
        <div className="modal login">
            <div className="modal-content account-content">
                <h2>Mon Compte</h2>

                <button className="imageButton">
                    <img src={profileImgUrlFetch} alt="Profil" />
                    <span className="hoverText">Modifier la photo</span>
                </button>

                <div className="nameField">
                    <h3>{fullName || "Nom inconnu"}</h3>
                    <button className="editName">
                        {pen({size: 24, color: "var(--primary-color)"})}
                    </button>
                </div>
                <p>{email || "Email inconnu"}</p>

                <button className="logoutButton" onClick={onLogout}>Déconnexion</button>
            </div>
        </div>
    );
};

export default Account;
