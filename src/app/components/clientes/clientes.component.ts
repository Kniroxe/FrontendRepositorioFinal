import { Component } from '@angular/core';
import { Cliente } from '../../models/Cliente.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientesService } from '../../services/clientes.service';
import Swal from 'sweetalert2';

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

//listar cliente
ngOnInit(): void {
  this.listarClientes();
  }

  listarClientes(){
    this.clienteService.getClientes().subscribe({
      next: resp => {
        this.clientes = resp;
        console.log(this.clientes);
      }
    })
  }


  toogleForm() : void{
    this.showForm = !this.showForm;
    this.textoModal = 'Nuevo Cliente';
    this.isEditMode = false;
    this.selectedCliente = null;
    this.clienteForm.reset();
    }

    //editar cliente
editCiente(cliente: Cliente): void {
  this.selectedCliente = cliente;
  this.textoModal = 'Editando cliente: ' + cliente.nombre;
  this.isEditMode = true;
  this.showForm = true;

  this.clienteForm.patchValue({
    ...cliente
  })
  
  }


//eliminar cliente
deleteClientes(cliente: Cliente): void {
  Swal.fire({
    title: `¿Eliminar cliente "${cliente.nombre}"?`,
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      if (cliente.id !== null && cliente.id !== undefined) {
        this.clienteService.deleteClientes(cliente.id).subscribe({
          next: () => {
            this.clientes = this.clientes.filter(a => a.id !== cliente.id);
            Swal.fire({
              title: '¡Eliminada!',
              text: 'El cliente ha sido eliminado correctamente.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar El cliente.',
              icon: 'error'
            });
          }
        });
      } else {
        Swal.fire({
          title: 'ID no válido',
          text: 'No se puede eliminar un cliente sin un ID válido.',
          icon: 'error'
        });
      }
      
    }
  });
}

//actualizar cliente
onsubmit(): void {
  if(this.clienteForm.invalid) {
    return;
  }
  const clienteData: Cliente = this.clienteForm.value;
  if(this.isEditMode){
      this.clienteService.putClientes(clienteData).subscribe({
      next: updateCliente => {
        const index = this.clientes.findIndex(a => a.id == clienteData.id);
        if(index !==-1) {
          this.clientes[index] = updateCliente;
        }
        Swal.fire({
          title: 'Cliente "' + updateCliente.nombre + '" actualizado',
          text: 'El cliente fue actualizado exitosamente',
          icon: 'success'
        })
        this.showForm = false;
        this.clienteForm.reset();
      },
      error: error => {
         this.mostrarErrores(error);
      }
      })

  }else { //Insertar cliente
this.clienteService.postClientes(clienteData).subscribe({
      next: newCliente => {
       this.clientes.push(newCliente);
       const index = this.clientes.findIndex(a=>a.id==clienteData.id);

        Swal.fire({
          title: 'Cliente "' + newCliente.nombre + '" creado',
          text: 'El cliente fue creado exitosamente',
          icon: 'success'
        })
        this.showForm = false;
        this.clienteForm.reset();
      },
      error: error => {
        this.mostrarErrores(error);
      }
      })
  }
}

mostrarErrores(errorResponse: any): void {
  if(errorResponse && errorResponse.error){
    let errores = errorResponse.error;
    let mensajeErrores = '';
    for(let campo in errores) {
      if(errores.hasOwnProperty(campo)) {
        mensajeErrores += errores[campo] +  "\n";
      }
    }
    Swal.fire({
      icon: 'error',
      title: 'Errores encontrados',
      text: mensajeErrores.trim()
    });
  }
  }

}
