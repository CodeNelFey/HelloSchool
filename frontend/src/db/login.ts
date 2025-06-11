export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: {
        id: number;
        firstname: string;
        lastname: string;
        email: string;
    };
}

async function init() {
    const data = await fetch('/url.json')
    const json =  await data.json()
    return json.api_url
}

const API_BASE = init();

export async function loginUser(data: LoginData): Promise<LoginResponse> {
    console.log(API_BASE)
    try {
        const response = await fetch(`http://${API_BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        const resData = await response.json();

        if (!response.ok) {
            return { success: false, message: resData.message || "Erreur lors de la connexion" };
        }

        return {
            success: true,
            message: resData.message,
            token: resData.token,
            user: resData.user,
        };
    } catch (error) {
        console.error("Erreur API login:", error);
        return { success: false, message: "Impossible de contacter le serveur" };
    }
}

