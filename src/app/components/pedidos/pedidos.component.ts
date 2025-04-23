import { Component } from '@angular/core';
import { Pedido } from '../../models/Pedido.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidosService } from '../../services/pedidos.service';

@Component({
  selector: 'app-pedidos',
  standalone: false,
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent {

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
