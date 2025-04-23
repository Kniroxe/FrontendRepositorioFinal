import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Pedido } from '../models/Pedido.model';
import { Cliente } from '../models/Cliente.model';
import { Estado } from '../models/Estado.model';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  // private apiUrl = 'http://localhost:8090/api/pedidos';

  // Mock data for testing
  private mockClientes: Cliente[] = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', telefono: 5551234567, direccion: 'Calle Principal 123' },
    { id: 2, nombre: 'María', apellido: 'Gómez', email: 'maria@example.com', telefono: 5559876543, direccion: 'Avenida Central 456' },
    { id: 3, nombre: 'Carlos', apellido: 'Rodríguez', email: 'carlos@example.com', telefono: 5552223333, direccion: 'Plaza Mayor 789' }
  ];

  private mockEstados: Estado[] = [
    { id: 1, descripcion: 'Pendiente' },
    { id: 2, descripcion: 'En Proceso' },
    { id: 3, descripcion: 'Completado' },
    { id: 4, descripcion: 'Cancelado' }
  ];

  private mockPedidos: Pedido[] = [
    {
      id: 1,
      cliente: this.mockClientes[0],
      productos: [], // Add mock products if needed
      total: 299.99,
      fechaCreacion: new Date('2023-05-15'),
      estadoId: 1
    }
  ];

  // constructor(private http: HttpClient) { }

  // Get all pedidos (mock for now)
  getPedidos(): Observable<Pedido[]> {
    // TODO: Replace with actual API call
    // return this.http.get<Pedido[]>(this.apiUrl);
    return of(this.mockPedidos);
  }


}
