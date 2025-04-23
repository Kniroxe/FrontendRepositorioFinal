import { Injectable } from '@angular/core';
import { enviroment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/Producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiUrl:string = enviroment.apiUrl + 'productos/';

  constructor(private http: HttpClient) { }

      getProductos(): Observable<Producto[]>{
        return this.http.get<Producto[]>(this.apiUrl);
      }
    
      postProductos(producto: Producto): Observable<Producto> {
        return this.http.post<Producto>(this.apiUrl, producto);
      }
    
      putProductos(producto: Producto): Observable<Producto> {
        return this.http.put<Producto>(`${this.apiUrl}${producto.id}`, producto);
      }
    
      deleteProductos(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}${id}`);
      }  

}
