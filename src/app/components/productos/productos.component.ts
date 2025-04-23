import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../models/Producto.model';
import { ProductosService } from '../../services/productos.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  productoForm: FormGroup;
  showForm: boolean = false;
  textoModal: string = 'Nuevo Producto';
  isEditMode: boolean = false;
  selectedProducto: Producto | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private productosService: ProductosService,
    private formBuilder: FormBuilder
  ) {
    this.productoForm = formBuilder.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(): void {
    this.loading = true;
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar productos: ' + error.message;
        this.loading = false;
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  onSubmit(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const productoData: Producto = this.productoForm.value;

    if (this.isEditMode && productoData.id) {
      this.productosService.updateProducto(productoData).subscribe({
        next: () => {
          this.successMessage = 'Producto actualizado correctamente';
          this.resetForm();
          this.loadProductos();
          this.showForm = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al actualizar producto: ' + error.message;
          this.loading = false;
        }
      });
    } else {
      this.productosService.createProducto(productoData).subscribe({
        next: () => {
          this.successMessage = 'Producto creado correctamente';
          this.resetForm();
          this.loadProductos();
          this.showForm = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al crear producto: ' + error.message;
          this.loading = false;
        }
      });
    }
  }

  editProducto(producto: Producto): void {
    this.isEditMode = true;
    this.selectedProducto = producto;
    this.textoModal = 'Editar Producto';
    this.showForm = true;
    this.productoForm.patchValue({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock
    });
  }

  deleteProducto(id: number | null): void {
    if (!id) return;

    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.loading = true;
      this.productosService.deleteProducto(id).subscribe({
        next: () => {
          this.successMessage = 'Producto eliminado correctamente';
          this.loadProductos();
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar producto: ' + error.message;
          this.loading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.productoForm.reset({
      id: null,
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0
    });
    this.isEditMode = false;
    this.selectedProducto = null;
    this.textoModal = 'Nuevo Producto';
    this.loading = false;

    // Clear messages after 3 seconds
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }

  get nombre() { return this.productoForm.get('nombre'); }
  get descripcion() { return this.productoForm.get('descripcion'); }
  get precio() { return this.productoForm.get('precio'); }
  get stock() { return this.productoForm.get('stock'); }
}
