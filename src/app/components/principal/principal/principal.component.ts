import { Component } from '@angular/core';
import { Pedido } from '../../../models/Pedido.model';
import { Cliente } from '../../../models/Cliente.model';
import { Producto } from '../../../models/Producto.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidosService } from '../../../services/pedidos.service';
import { ClientesService } from '../../../services/clientes.service';

@Component({
  selector: 'app-principal',
  standalone: false,
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {

  pedidos: Pedido[] = [];
  clientes: Cliente[] = [];
  pedidosFiltrados: Pedido[] = [];

  clienteSeleccionado: Cliente | null = null;

  pedidoForm: FormGroup;
  showForm: boolean = false;
  textoModal: string = 'Nuevo pedido';
  isEditMode: boolean = false;

  constructor(
    private pedidoService: PedidosService,
    private clienteService: ClientesService,
    private formBuilder: FormBuilder
  ) {
    this.pedidoForm = formBuilder.group({
      id: [null],
      cliente: ['', [Validators.required]],
      total: ['', [Validators.required, Validators.maxLength(50)]],
      fechaCreacion: ['', [Validators.required, Validators.maxLength(50)]],
      estado: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.listarPedidos();
    this.listarClientes();
  }

  listarPedidos(): void {
    this.pedidoService.getPedidos().subscribe({
      next: (resp) => {
        this.pedidos = resp;
        console.log('Pedidos cargados:', this.pedidos);
      },
      error: (error) => {
        console.error('Error al cargar pedidos', error);
      }
    });
  }

  listarClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (resp) => {
        this.clientes = resp;
        console.log('Clientes cargados:', this.clientes);
      },
      error: (error) => {
        console.error('Error al cargar clientes', error);
      }
    });
  }

  onSeleccionCliente(cliente: Cliente | null): void {
    this.clienteSeleccionado = cliente;
    if (cliente && cliente.id) {
      this.filtrarPedidosPorCliente(cliente.id);  // Ya no necesitas buscar en el array clientes
    } else {
      this.pedidosFiltrados = [];
    }
  }
  

  filtrarPedidosPorCliente(clienteId: number): void {
    // Si cada pedido tiene un objeto cliente, filtramos por cliente.id
    this.pedidosFiltrados = this.pedidos.filter(pedido => pedido.cliente && pedido.cliente.id === clienteId);
  }


  
}
