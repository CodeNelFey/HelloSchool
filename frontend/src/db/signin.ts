export interface CreateUserData {
    nom: string;
    prenom: string;
    email: string;
    password: string;
    birthdate: string;
}

async function init() {
    const data = await fetch('/url.json')
    const json =  await data.json()
    return json.api_url
}

const API_BASE = init();

export async function createUser(userData: CreateUserData): Promise<{ success: boolean; message: string }> {
    console.log("Données envoyées :", userData);

    try {
        const response = await fetch(`http://${API_BASE}/api/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData),
            credentials: 'include'  // Ajouté ici pour autoriser cookies/session si besoin
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || "Erreur lors de l'inscription" };
        }

        return { success: true, message: "Utilisateur créé avec succès" };
    } catch (error) {
        console.error("Erreur API:", error);
        return { success: false, message: "Impossible de contacter le serveur" };
    }
}
