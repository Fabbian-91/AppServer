export interface Usuario {
    id?: number;
    userName: string;
    password: string;
    role: string;
    estado: boolean;
}

export interface usuarioApiResponse {
    message: string,
    data: Usuario[]
}