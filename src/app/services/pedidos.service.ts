import {Injectable} from '@angular/core';
import {enviroment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Pedido} from '../models/Pedido.model';
import {Cliente} from '../models/Cliente.model';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private apiUrl: string = enviroment.apiUrl + 'pedidos/';

  constructor(private http: HttpClient) {
  }

  getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(enviroment.apiUrl + 'clientes/');
  }

  deletePedidos(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}`);
  }

  updatePedidoEstado(pedido: Pedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}${pedido.id}`, pedido);
  }

}
