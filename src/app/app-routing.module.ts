import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './components/clientes/clientes.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { ProductosComponent } from './components/productos/productos.component';

const routes: Routes = [
  {path: 'clientes', component: ClientesComponent},
  {path: 'pedidos', component: PedidosComponent},
  {path: 'productos', component: ProductosComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
