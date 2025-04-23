import { Component } from '@angular/core';
import { Cliente } from '../../models/Cliente.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-clientes',
  standalone: false,
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {

  clientes: Cliente[] = [];
  clienteForm: FormGroup;
  showForm: boolean = false;
  textoModal: string = 'Nuevo Cliente';
  isEditMode: boolean = false;
  selectedCliente: Cliente | null = null;

  constructor(
    private clienteService: ClientesService,
    private formBuilder: FormBuilder
  ){
    this.clienteForm = formBuilder.group({
      id:[null],
      nombre: ['',[Validators.required, Validators.maxLength(50)]],
      apellido: ['',[Validators.required, Validators.maxLength(50)]],
      email:['',[Validators.required, Validators.maxLength(50)]],
      telefono:['',[Validators.required]],
      direccion:['',[Validators.required, Validators.maxLength(50)]],
    })

  }

}
