import { ProductoDTO } from "./ProductoDTO.model";
import { Cliente } from "./Cliente.model";
export interface PedidoDTO {
    cliente: Cliente|null;
    productos: ProductoDTO[];
  }