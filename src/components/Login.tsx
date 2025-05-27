interface LoginProps {
    setIsModalOpen: (isOpen: boolean) => void;
}

function Login({ setIsModalOpen }: LoginProps) {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Connexion</h2>
                <button onClick={() => setIsModalOpen(false)}>Fermer</button>
            </div>
        </div>
    );
}

export default Login;