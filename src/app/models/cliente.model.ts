//Interfaz con los datos que devuelve el dto
export interface getAllCliente {
    id: number;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    correo: string;
}   

export interface clienteApiResponse{
    message:string;
    data:getAllCliente[];
}
