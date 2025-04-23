import { Component } from '@angular/core';
import { Pedido } from '../../models/Pedido.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidosService } from '../../services/pedidos.service';
import Swal from 'sweetalert2';

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
      total:['',[Validators.required]],
      fechaCreacion:['',[Validators.required, Validators.maxLength(50)]],
      estado:['',[Validators.required]]
    })

  }


  //listar producto
  ngOnInit(): void {
    this.listarPedidos();
    }
  
    listarPedidos(){
      this.pedidoService.getPedidos().subscribe({
        next: resp => {
          this.pedidos = resp;
          console.log(this.pedidos);
        }
      })
    }


          //eliminar pedido
          deletePedidos(pedido: Pedido): void {
            Swal.fire({
              title: `¿Cancelar pedido "${pedido.id}"?`,
              text: 'Esta acción no se puede deshacer.',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Sí, eliminar',
              cancelButtonText: 'Cancelar'
            }).then((result) => {
              if (result.isConfirmed) {
                if (pedido.id !== null && pedido.id !== undefined) {
                  this.pedidoService.deletePedidos(pedido.id).subscribe({
                    next: () => {
                      this.pedidos = this.pedidos.filter(a => a.id !== pedido.id);
                      Swal.fire({
                        title: '¡Eliminado!',
                        text: 'El producto ha sido eliminado correctamente.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                      });
                    },
                    error: (err) => {
                      Swal.fire({
                        title: 'Error',
                        text: 'No se pudo eliminar El producto.',
                        icon: 'error'
                      });
                    }
                  });
                } else {
                  Swal.fire({
                    title: 'ID no válido',
                    text: 'No se puede eliminar un producto sin un ID válido.',
                    icon: 'error'
                  });
                }
                
              }
            });
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
