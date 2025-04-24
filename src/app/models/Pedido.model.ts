import { Cliente } from "./Cliente.model";
import { Producto } from "./Producto.model";

export interface Pedido {
	id: number | null;
	cliente: Cliente;
	productos: Producto[];
	total: number;
	fechaCreacion: string;
	estado: number;
}
