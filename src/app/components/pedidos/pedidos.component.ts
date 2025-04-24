import {Component} from '@angular/core';
import {Pedido} from '../../models/Pedido.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PedidosService} from '../../services/pedidos.service';
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
  ) {
    this.pedidoForm = formBuilder.group({
      id: [null],
      cliente: ['', [Validators.required]],
      total: ['', [Validators.required]],
      fechaCreacion: ['', [Validators.required, Validators.maxLength(50)]],
      estado: ['', [Validators.required]]
    })

  }


  ngOnInit(): void {
    this.listarPedidos();
  }

  listarPedidos() {
    this.pedidoService.getPedidos().subscribe({
      next: resp => {
        this.pedidos = resp;
        console.log(this.pedidos);
      }
    })
  }


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
    if (errorResponse && errorResponse.error) {
      let errores = errorResponse.error;
      let mensajeErrores = '';
      for (let campo in errores) {
        if (errores.hasOwnProperty(campo)) {
          mensajeErrores += errores[campo] + "\n";
        }
      }
      Swal.fire({
        icon: 'error',
        title: 'Errores encontrados',
        text: mensajeErrores.trim()
      });
    }
  }

  getEstadoNombre(estado: number): string {
    switch (estado) {
      case 1:
        return 'Pendiente';
      case 2:
        return 'Enviado';
      case 3:
        return 'Entregado';
      default:
        return 'Desconocido';
    }
  }

  cambiarEstado(pedido: Pedido, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newEstado = parseInt(selectElement.value);

    if (pedido.estado === 3) {
      Swal.fire({
        title: 'No permitido',
        text: 'Los pedidos entregados no pueden cambiar de estado',
        icon: 'warning'
      });
      selectElement.value = pedido.estado.toString();
      return;
    }

    // Store the old state name for the alert
    const oldEstadoNombre = this.getEstadoNombre(pedido.estado);
    const newEstadoNombre = this.getEstadoNombre(newEstado);

    Swal.fire({
      title: 'Confirmar cambio de estado',
      text: `¿Desea cambiar el estado de "${oldEstadoNombre}" a "${newEstadoNombre}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Create a copy of the pedido with the new estado
        const updatedPedido: Pedido = {
          ...pedido,
          estado: newEstado
        };


        this.pedidoService.updatePedidoEstado(updatedPedido).subscribe({
          next: (updated) => {
            // Update the local pedido object with the response
            pedido.estado = newEstado;

            Swal.fire({
              title: 'Estado actualizado',
              text: `El estado ha sido cambiado de "${oldEstadoNombre}" a "${newEstadoNombre}"`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            // Reset the select to the original value
            selectElement.value = pedido.estado.toString();
            this.mostrarErrores(err);
          }
        });
      } else {
        // If cancelled, reset the select to the original value
        selectElement.value = pedido.estado.toString();
      }
    });
  }

}
