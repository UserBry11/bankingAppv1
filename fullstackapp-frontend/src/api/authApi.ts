import { apiClient, getCsrfToken } from "./apiClient";


export type RegisterRequest = {
    username: string;
    name: string;
    password: string;
};

export type LoginRequest = {
    username: string;
    password: string;
}

export type AuthUser = {
    id: number;
    username: string;
    name: string;
}

export async function registerUser(request: RegisterRequest): Promise<AuthUser> {
    const csrf = await getCsrfToken();
    const response = await apiClient.post<AuthUser>("/api/auth/register", request,
        {
            headers: { 
                    [csrf.headerName]: csrf.token,
                },
        }
    );
    return response.data;
}

export async function loginUser(request: LoginRequest): Promise<void> {
    const csrf = await getCsrfToken();
    const formData = new URLSearchParams();

    formData.set("username", request.username);
    formData.set("password", request.password);

    await apiClient.post("/api/auth/login", formData, 
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded", 
                [csrf.headerName]: csrf.token,
            },
        }
    );
}

export async function getCurrentUser(): Promise<AuthUser | null>{
    try {
        const response = await apiClient.get<AuthUser>("/api/auth/me");

        if(response.data && (response.data.id || response.data.username)){
            return response.data;
        }
        return null;
    } catch (error){
        console.warn("User session endpoint returned an authentication error status.");
        return null;
    }
}

export async function logoutUser(): Promise<void>{
    const csrf = await getCsrfToken();
    await apiClient.post("/api/auth/logout", {}, 
        {
            headers: {
                [csrf.headerName]: csrf.token,
            },
        });
}
