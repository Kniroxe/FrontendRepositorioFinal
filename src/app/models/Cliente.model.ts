import { Pedido } from "./Pedido.model";

export interface Cliente{

	id: number | null;

	nombre: string;

	apellido: string;

	email: string;

	telefono: number;

	direccion: string;

	pedidos: Pedido[]; 

}