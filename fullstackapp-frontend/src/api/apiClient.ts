import axios from "axios";

export const apiClient = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export type CsrfResponse = {
    "headerName": string;
    "token": string;
}

export async function getCsrfToken(): Promise<CsrfResponse> {
    const response = await apiClient.get<CsrfResponse>("/api/auth/csrf");
    return response.data;
}