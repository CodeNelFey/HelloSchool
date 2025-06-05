interface SigninProps {
    setModalType: (type: "login" | "signin" | null) => void;
}

function Signin({ setModalType }: SigninProps) {
    return (
        <div className="modal signin">
        <div className="modal-content signin-content">
            <h2>Créer un compte</h2>
    <form onSubmit={(e) => e.preventDefault()}>
    <input type="text" placeholder="Nom" />
    <input type="email" placeholder="Adresse mail" />
    <input type="password" placeholder="Mot de passe" />
    <input type="submit" value="S'inscrire" />
        </form>
        <button onClick={() => setModalType("login")}>
    Déjà un compte ? Connexion
        </button>
        <button onClick={() => setModalType(null)}>Fermer</button>
    </div>
    </div>
);
}

export default Signin;
