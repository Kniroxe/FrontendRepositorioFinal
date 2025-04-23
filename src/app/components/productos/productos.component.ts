import { Component } from '@angular/core';
import { Producto } from '../../models/Producto.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';

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
  selectedPedido: Producto | null = null;

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

}
