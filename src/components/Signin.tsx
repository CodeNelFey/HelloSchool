import {useState} from "react";
import PasswordRules from "./PasswordRules";

interface SigninProps {
    setModalType: (type: "login" | "signin" | null) => void;
}

function Signin({ setModalType }: SigninProps) {


    const [password, setPassword] = useState('');

    return (
        <div className="modal signin">
            <div className="modal-content signin-content">
                <h2>Créer un compte</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <label>
                        Nom
                        <input type="text" placeholder="Ex. Dupont" />
                    </label>
                    <label>
                        Prénom
                        <input type="text" placeholder="Ex. Jean" />
                    </label>
                    <label>
                        Adresse mail
                        <input type="email" placeholder="Ex. jean.dupont@mail.com" />
                    </label>
                    <label>
                        Date de naissance
                        <input type="date" placeholder="Ex. 1990-01-01" />
                    </label>
                    <label>
                        Mot de passe
                        <input type="password"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                        />
                        {password && <PasswordRules password={password} />}
                    </label>
                    <label>
                        Confirmer mon mot de passe
                        <input type="password" />
                    </label>
                    <button onClick={() => setModalType("login")}>
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
