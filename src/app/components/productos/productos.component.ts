import { Component } from '@angular/core';
import { Producto } from '../../models/Producto.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {

productos: Producto[] =[];
productoForm: FormGroup;
  showForm: boolean = false;
  textoModal: string = 'Nuevo Producto';
  isEditMode: boolean = false;
  selectedProducto: Producto | null = null;

  constructor(
    private productoService: ProductosService,
    private formBuilder: FormBuilder
  ){
    this.productoForm = formBuilder.group({
      id:[null],
      nombre: ['',[Validators.required, Validators.maxLength(50)]],
      descripcion: ['',[Validators.required, Validators.maxLength(50)]],
      precio:['',[Validators.required]],
      stock:['',[Validators.required, Validators.maxLength(50)]]
    })

  }

  //listar producto
ngOnInit(): void {
  this.listarProductos();
  }

  listarProductos(){
    this.productoService.getProductos().subscribe({
      next: resp => {
        this.productos = resp;
        console.log(this.productos);
      }
    })
  }

  toogleForm() : void{
    this.showForm = !this.showForm;
    this.textoModal = 'Nuevo Producto';
    this.isEditMode = false;
    this.selectedProducto = null;
    this.productoForm.reset();
    }

        //editar producto
    editProducto(producto: Producto): void {
      this.selectedProducto = producto;
      this.textoModal = 'Editando producto: ' + producto.nombre;
      this.isEditMode = true;
      this.showForm = true;
    
      this.productoForm.patchValue({
        ...producto
      })
      
      }


      //eliminar producto
      deleteProductos(producto: Producto): void {
        Swal.fire({
          title: `¿Eliminar producto "${producto.nombre}"?`,
          text: 'Esta acción no se puede deshacer.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            if (producto.id !== null && producto.id !== undefined) {
              this.productoService.deleteProductos(producto.id).subscribe({
                next: () => {
                  this.productos = this.productos.filter(a => a.id !== producto.id);
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


      //actualizar producto
      onsubmit(): void {
        if(this.productoForm.invalid) {
          return;
        }
        const productoData: Producto = this.productoForm.value;
        if(this.isEditMode){
            this.productoService.putProductos(productoData).subscribe({
            next: updateProducto => {
              const index = this.productos.findIndex(a => a.id == productoData.id);
              if(index !==-1) {
                this.productos[index] = updateProducto;
              }
              Swal.fire({
                title: 'Producto "' + updateProducto.nombre + '" actualizado',
                text: 'El producto fue actualizado exitosamente',
                icon: 'success'
              })
              this.showForm = false;
              this.productoForm.reset();
            },
            error: error => {
               this.mostrarErrores(error);
            }
            })
      
        }else { //Insertar producto
      this.productoService.postProductos(productoData).subscribe({
            next: newProducto => {
             this.productos.push(newProducto);
             const index = this.productos.findIndex(a=>a.id==productoData.id);
      
              Swal.fire({
                title: 'Producto "' + newProducto.nombre + '" creado',
                text: 'El producto fue creado exitosamente',
                icon: 'success'
              })
              this.showForm = false;
              this.productoForm.reset();
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
