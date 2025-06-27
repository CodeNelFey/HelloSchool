import { api_url } from "./api";

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    token?: string;
    refreshToken?: string;
    user?: {
        id: number;
        firstname: string;
        lastname: string;
        email: string;
    };
}

const API_BASE = api_url;

export async function loginUser(data: LoginData): Promise<LoginResponse> {
    try {
        const response = await fetch(`http://${API_BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const resData = await response.json();

        if (!response.ok) {
            return { success: false, message: resData.message || "Erreur lors de la connexion" };
        }

        // Stocker token et user dans localStorage
        if (resData.token) localStorage.setItem("accessToken", resData.token);
        if (resData.refreshToken) localStorage.setItem("refreshToken", resData.refreshToken);
        if (resData.user) localStorage.setItem("user", JSON.stringify(resData.user));

        return {
            success: true,
            message: resData.message,
            token: resData.token,
            refreshToken: resData.refreshToken,
            user: resData.user,
        };
    } catch (error) {
        console.error("Erreur API login:", error);
        return { success: false, message: "Impossible de contacter le serveur" };
    }
}

