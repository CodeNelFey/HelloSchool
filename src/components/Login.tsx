interface LoginProps {
    setModalType: (type: "login" | "signin" | null) => void;
}

function Login({ setModalType }: LoginProps) {
    return (
        <div className="modal login">
            <div className="modal-content login-content">
                <h2>Connexion</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <input type="text" placeholder="Adresse mail" />
                    <input type="password" placeholder="Mot de passe" />
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
