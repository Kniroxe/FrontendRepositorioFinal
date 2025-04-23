// src/app/components/pedidos/pedidos.component.ts
import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../models/Pedido.model';
import { PedidosService } from '../../services/pedido.service';  // Make sure path matches your file name

@Component({
  selector: 'app-pedidos',
  standalone: false,
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  loading = true;
  error = '';

  constructor(private pedidosService: PedidosService) { }

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.loading = true;
    this.pedidosService.getPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los pedidos: ' + err.message;
        this.loading = false;
      }
    });
  }

  getEstadoDescripcion(estadoId: number): string {
    switch(estadoId) {
      case 1: return 'Pendiente';
      case 2: return 'En Proceso';
      case 3: return 'Completado';
      case 4: return 'Cancelado';
      default: return 'Desconocido';
    }
  }
}
