import {api_url} from "./api";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    imageUrl?: string;
}

const API_BASE = api_url

const PROFILE_PIC_PATH = `${API_BASE}/api/profile-pics`;

/**
 * Récupère les informations de l'utilisateur connecté à partir du localStorage.
 */
export async function getCurrentUser(): Promise<User> {
    const userData = localStorage.getItem("user");

    // Utilisateur inconnu : on retourne un "user vide"
    if (!userData) return getDefaultUser();

    try {
        const idUser = JSON.parse(userData).id;
        const user = await getUserById(idUser);

        return user ?? getDefaultUser();
    } catch {
        return getDefaultUser();
    }
}

// Fonction utilitaire : un utilisateur vide ou par défaut
function getDefaultUser(): User {
    return {
        id: -1,
        firstName: "Invité",
        lastName: "",
        email: "inconnu@exemple.com",
        imageUrl: undefined,
    };
}


export async function getUserById(id: string): Promise<User | null> {
    try {
        const res = await fetch(`http://${API_BASE}/api/users/getUserByID/${id}`);
        if (!res.ok) throw new Error('Utilisateur non trouvé');

        const user: User = await res.json();
        return user;
    } catch (err) {
        console.error('Erreur récupération utilisateur', err);
        return null;
    }
}

/**
 * Renvoie le nom complet de l'utilisateur connecté.
 */
export async function getFullName(): Promise<string> {
    const user = await getCurrentUser();
    return user ? `${user.firstName} ${user.lastName}` : "";
}

export async function getFirstName(): Promise<string> {
    const user = await getCurrentUser();
    return user ? user.firstName : ""
}

/**
 * Renvoie l'URL de l'image de profil de l'utilisateur connecté.
 * Si aucune image n'est trouvée, retourne l'image par défaut.
 */
export async function getProfileImageUrl(): Promise<string> {
    const user = await getCurrentUser();

    if (!user) return `http://${PROFILE_PIC_PATH}/default-profile.png`;

    const imageUrl = `http://${PROFILE_PIC_PATH}/${user.id}.jpg`;

    try {
        const res = await fetch(imageUrl, { method: 'HEAD' });
        if (res.ok) {
            return imageUrl;
        } else {
            return `http://${PROFILE_PIC_PATH}/default-profile.png`;
        }
    } catch {
        return `http://${PROFILE_PIC_PATH}/default-profile.png`;
    }
}


export async function getProfileImageUrlById(userId: number | string): Promise<string> {
    if (!userId) return `http://${PROFILE_PIC_PATH}/default-profile.png`;

    const imageUrl = `http://${PROFILE_PIC_PATH}/${userId}.jpg`;

    try {
        const res = await fetch(imageUrl, { method: 'HEAD' });
        if (res.ok) {
            return imageUrl;
        } else {
            return `http://${PROFILE_PIC_PATH}/default-profile.png`;
        }
    } catch {
        return `http://${PROFILE_PIC_PATH}/default-profile.png`;
    }
}



/**
 * Renvoie l’adresse e-mail de l'utilisateur connecté.
 */
export async function getEmail(): Promise<string> {
    const user = await getCurrentUser();
    return user?.email ?? "";
}

/**
 * Vérifie si un utilisateur est connecté (présence de token et user).
 */
export function isLoggedIn(): boolean {
    const token = localStorage.getItem("token");
    const user = getCurrentUser();
    return !!token && !!user;
}

/**
 * Déconnecte l'utilisateur.
 */
export function logout(): void {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
}


export async function uploadProfileImage(userId: number, file: File) {
    const formData = new FormData();
    formData.append("profile", file);

    const res = await fetch(`http://localhost:5000/api/users/getUserByID/${userId}/upload-profile`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Échec de l'upload de l'image.");
    }

    const data = await res.json();
    return data.path;
}

export async function searchUsers(query: string): Promise<User[]> {
    if (!query.trim()) return [];

    try {
        const response = await fetch(`http://localhost:5000/api/users/search?query=${encodeURIComponent(query)}`);

        const text = await response.text(); // 👈 décode manuellement
        console.log('Réponse brute:', text);

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.statusText}`);
        }

        const users: User[] = JSON.parse(text);

        return users.map((user) => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email ?? '',
        }));
    } catch (error) {
        console.error('Erreur lors de la recherche des utilisateurs:', error);
        return [];
    }
}
