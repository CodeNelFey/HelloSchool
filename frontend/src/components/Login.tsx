import { useState } from "react";
import { loginUser } from "../db/login";

interface LoginProps {
    setModalType: (type: "login" | "signin" | null) => void;
    showNotification: (message: string, type: "error" | "success" | "info") => void;
}

function Login({ setModalType, showNotification }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            showNotification("Merci de remplir tous les champs.", "error");
            return;
        }

        const { success, message: msg, token, user } = await loginUser({ email, password });

        if (!success) {
            showNotification(msg, "error");
            return;
        }

        if (token && user) {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            showNotification(`Bienvenue ${user.firstname} !`, "success");
            setModalType(null);
        }
    };

    return (
        <div className="modal login">
            <div className="modal-content login-content">
                <h2>Connexion</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Adresse mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="button" onClick={() => setModalType("signin")}>
                        Je n'ai pas de compte.
                    </button>
                    <input type="submit" value="Se connecter" />
                </form>
                <button onClick={() => setModalType(null)}>Fermer</button>
            </div>
        </div>
    );
}

export default Login;
