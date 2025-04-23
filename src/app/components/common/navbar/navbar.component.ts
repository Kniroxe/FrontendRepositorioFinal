import { Component } from '@angular/core';
import { Cliente } from '../../../models/Cliente.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientesService } from '../../../services/clientes.service';
import { Pedido } from '../../../models/Pedido.model';
import { PedidosService } from '../../../services/pedidos.service';

@Component({
  selector: 'app-ecommerce-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  pedidos: Pedido[] = [];
  pedidoForm: FormGroup;
  showForm: boolean = false;
  textoModal: string = 'Nuevo Pedido';
  isEditMode: boolean = false;
  selectedPedido: Pedido | null = null;


  constructor(
    private pedidoService: PedidosService,
    private formBuilder: FormBuilder
  ){
    this.pedidoForm = formBuilder.group({
      id:[null],
      cliente: ['',[Validators.required]],
      producto: ['',[Validators.required]],
      total:['',[Validators.required]],
      fechaCreacion:['',[Validators.required, Validators.maxLength(50)]],
      estado:['',[Validators.required]]
    })

  }

}
