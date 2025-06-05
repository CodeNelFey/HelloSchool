import { useState } from "react";
import PasswordRules from "./PasswordRules";
import { createUser } from "../db/signin";

interface SigninProps {
    setModalType: (type: "login" | "signin" | null) => void;
    showNotification: (message: string, type: "error" | "success" | "info") => void;
}

function Signin({ setModalType, showNotification }: SigninProps) {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nom || !prenom || !email || !birthdate || !password || !confirmPassword) {
            showNotification("Merci de remplir tous les champs.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showNotification("Les mots de passe ne correspondent pas.", "error");
            return;
        }

        const { success, message } = await createUser({ nom, prenom, email, password, birthdate });

        if (!success) {
            showNotification(message, "error");
        } else {
            showNotification(message, "success");
            setTimeout(() => setModalType("login"), 1000);
        }
    };

    return (
        <div className="modal signin">
            <div className="modal-content signin-content">
                <h2>Créer un compte</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Nom
                        <input
                            type="text"
                            placeholder="Ex. Dupont"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Prénom
                        <input
                            type="text"
                            placeholder="Ex. Jean"
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Adresse mail
                        <input
                            type="email"
                            placeholder="Ex. jean.dupont@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Date de naissance
                        <input
                            type="date"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Mot de passe
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {password && <PasswordRules password={password} />}
                    </label>
                    <label>
                        Confirmer mon mot de passe
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>

                    <button type="button" onClick={() => setModalType("login")}>
                        J'ai déjà un compte.
                    </button>
                    <input type="submit" value="S'inscrire" />
                </form>
                <button onClick={() => setModalType(null)}>Fermer</button>
            </div>
        </div>
    );
}

export default Signin;
