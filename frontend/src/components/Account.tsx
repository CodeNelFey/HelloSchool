import React, { useEffect, useState } from 'react';
import { getEmail, getFullName, getProfileImageUrl, getCurrentUser } from "../db/account";
import { pen } from "../assets/svg";
import ImageUploadButton from "./imageUploadButton";

interface AccountProps {
    onLogout: () => void;
}

const Account: React.FC<AccountProps> = ({ onLogout }) => {
    const [userId, setUserId] = useState<number | null>(null);
    const [profileImgUrlFetch, setProfileImgUrlFetch] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

    useEffect(() => {
        async function fetchUserData() {
            const user = await getCurrentUser();
            setUserId(user.id);

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

                <div className="image-container">
                    {/* ✅ Placeholder visible tant que l’image ne s’est pas chargée */}
                    {!isImageLoaded && (
                        <div
                            className="imageButton loading-placeholder"
                            style={{
                                backgroundColor: "red",
                            }}
                        />
                    )}

                    {/* ✅ Image invisible juste pour détecter si elle a fini de charger */}
                    {profileImgUrlFetch && (
                        <img
                            src={profileImgUrlFetch}
                            alt="Préchargement"
                            style={{ display: "none" }}
                            onLoad={() => setIsImageLoaded(true)}
                        />
                    )}

                    {/* ✅ Composant réel, toujours affiché */}
                    {userId !== null && profileImgUrlFetch && (
                        <ImageUploadButton
                            userId={userId}
                            profileImgUrlFetch={profileImgUrlFetch}
                        />
                    )}
                </div>

                <div className="nameField">
                    {fullName ? (
                        <h3>{fullName}</h3>
                    ) : (
                        <h3 className="loading-placeholder">Chargement du nom</h3>
                    )}
                    <button className="editName">
                        {pen({ size: 24, color: "var(--primary-color)" })}
                    </button>
                </div>

                {email ? (
                    <p>{email}</p>
                ) : (
                    <p className="loading-placeholder">Chargement du mail</p>
                )}

                <button className="logoutButton" onClick={onLogout}>Déconnexion</button>
            </div>
        </div>
    );
};

export default Account;
