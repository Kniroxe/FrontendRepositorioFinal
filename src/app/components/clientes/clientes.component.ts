import { Component } from '@angular/core';
import { Cliente } from '../../models/Cliente.model';
import { Producto } from '../../models/Producto.model';
import { PedidoDTO } from '../../models/PedidoDTO.model';
import { ProductoDTO } from '../../models/ProductoDTO.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientesService } from '../../services/clientes.service';
import { ProductosService } from '../../services/productos.service';
import { PedidosService } from '../../services/pedidos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  standalone: false,
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {

  clientes: Cliente[] = [];
  productos: Producto[] = [];
  clienteForm: FormGroup;
  textoTotal: string = '0.00';
 // pedidoForm: FormGroup;
  showForm: boolean = false;
  textoModal: string = 'Nuevo Cliente';
  isEditMode: boolean = false;
  selectedCliente: Cliente | null = null;
  clienteSeleccionado: Cliente | null = null;
  productosSeleccionados: { producto: Producto, cantidad: number }[] = [];
  productoSeleccionadoId: number | null = null;
  productosSeleccionadosEnviados: { id: number; cantidad: number }[] = [];

  constructor(
    private clienteService: ClientesService,
    private productoService: ProductosService,
    private pedidoService: PedidosService,
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
  this.listarProductos();
  }

  listarClientes(){
    this.clienteService.getClientes().subscribe({
      next: resp => {
        this.clientes = resp;
        console.log(this.clientes);
      }
    })
  }

  listarProductos(){
    this.productoService.getProductos().subscribe({
      next: resp => {
        this.productos = resp;
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

seleccionarCliente(cliente: Cliente): void{
  this.clienteSeleccionado=cliente;
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
  console.log(clienteData);
3
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

  agregarProductoPedido(): void {
    const producto = this.productos.find(p => p.id === this.productoSeleccionadoId);
    
    let total:number= Number(this.textoTotal);
    if (!producto) return;
    total=total+producto.precio;
    this.textoTotal=total.toFixed(2);
    const yaExiste = this.productosSeleccionados.find(p => p.producto.id === producto.id);
    if (yaExiste) {
      yaExiste.cantidad += 1;
    } else {
      this.productosSeleccionados.push({ producto, cantidad: 1 });
    }
  
    // Reinicia el select si deseas
    this.productoSeleccionadoId = null;
  }

  eliminarProductoPedido(idProducto: number| null): void {
    this.productosSeleccionados = this.productosSeleccionados.filter(p => p.producto.id !== idProducto);
  }
  productoEntityToDTO(){

  }
  enviarPedido() {
    const productosRepetidos: ProductoDTO[] = [];
  
    //productosSeleccionados: { producto: Producto, cantidad: number }[] = [];
    this.productosSeleccionados.forEach(producto => {
      for (let i = 0; i < producto.cantidad; i++) {
        productosRepetidos.push({ id:producto.producto.id});
      }
    });
  

    const pedido: PedidoDTO = {
      cliente: this.clienteSeleccionado,
      productos: productosRepetidos,
    };
    
  //const pedidoEnviado: PedidoDTO = JSON.stringify(pedido);
  console.log(pedido);

   this.pedidoService.postPedidos(pedido).subscribe({
      next: (respuesta) => {
        console.log('Pedido enviado con éxito:', respuesta);
        Swal.fire({
          title: 'Pedido creado',
          text: 'El pedido ha sido creado',
          icon: 'success'
        })
        // limpiar o cerrar modal aquí
      },
      error: (error) => {
        console.error('Error al enviar pedido:', error);
      }
    });
  }
}
