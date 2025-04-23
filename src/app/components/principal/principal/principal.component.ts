import { Component } from '@angular/core';
import { Pedido } from '../../../models/Pedido.model';
import { Cliente } from '../../../models/Cliente.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientesService } from '../../../services/clientes.service';
import { PedidosService } from '../../../services/pedidos.service';

@Component({
  selector: 'app-principal',
  standalone: false,
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {

  pedidos: Pedido[] = [];
  clientes: Cliente[] = [];
  pedidoForm: FormGroup;
  showForm: boolean = false;
  textoModal: string = 'Nuevo pedido';
  isEditMode: boolean = false;

  constructor(
    private pedidoService: PedidosService,
    private formBuilder: FormBuilder
  ) {
    this.pedidoForm = formBuilder.group({
        id:[null],
        cliente: ['',[Validators.required]],
        total: ['',[Validators.required, Validators.maxLength(50)]],
        fechaCreacion: ['',[Validators.required, Validators.maxLength(50)]],
        estado: ['',[Validators.required]]
    })
  }

    //listar avion
ngOnInit(): void {
  this.listarPedidos();
  this.listarClientes();
}


listarPedidos(){
  this.pedidoService.getPedidos().subscribe({
    next: resp => {
      this.pedidos = resp;
      console.log(this.pedidos);
    }
  })
}

listarClientes(): void {
  this.pedidoService.getClientes().subscribe({
    next: (resp) => {
      this.clientes = resp;
      console.log('Clientes cargados:', this.clientes);
    },
    error: (error) => {
      console.error('Error al cargar clientes', error);
    }
  });
}

}
