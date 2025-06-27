import {api_url} from "./api";

const API_BASE = api_url

export async function fetchWithAuth(input: string, init: RequestInit = {}): Promise<Response> {
    let accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    const headers = {
        ...(init.headers || {}),
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    let res = await fetch(input, { ...init, headers });

    if (res.status === 401 && refreshToken) {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
            const { accessToken: newToken } = await refreshRes.json();
            localStorage.setItem('accessToken', newToken);
            headers.Authorization = `Bearer ${newToken}`;

            res = await fetch(input, { ...init, headers });
        } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
        }
    }

    return res;
}
