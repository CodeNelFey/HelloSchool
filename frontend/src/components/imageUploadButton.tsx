import React, { useRef } from 'react';
import {uploadProfileImage} from "../db/account";

type Props = {
    userId: number;
    profileImgUrlFetch: string;
};

function ImageUploadButton({ userId, profileImgUrlFetch }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            await uploadProfileImage(userId, file);
        } catch (err) {
            console.error("Erreur lors de l'upload :", err);
        }
    };

    return (
        <>
            <button className="imageButton" onClick={handleButtonClick}>
                <img src={profileImgUrlFetch} alt="Profil" />
                <span className="hoverText">Modifier la photo</span>
            </button>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </>
    );
}

export default ImageUploadButton;
