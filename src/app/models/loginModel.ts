export interface LoginModel {
    userName: string,
    password: string
}

export interface LoginResponse {
    token: string,
    role: string,
    user: {
        id: number,
        name: string,
        email: string
    }
}