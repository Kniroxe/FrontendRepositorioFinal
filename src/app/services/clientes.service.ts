import { Injectable } from '@angular/core';
import { enviroment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/Cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiUrl:string = enviroment.apiUrl + 'clientes/';

  constructor(private http: HttpClient) { }

    getClientes(): Observable<Cliente[]>{
      return this.http.get<Cliente[]>(this.apiUrl);
    }
  
    postClientes(cliente: Cliente): Observable<Cliente> {
      return this.http.post<Cliente>(this.apiUrl, cliente);
    }
  
    putClientes(cliente: Cliente): Observable<Cliente> {
      return this.http.put<Cliente>(`${this.apiUrl}${cliente.id}`, cliente);
    }
  
    deleteClientes(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}${id}`);
    } 


}
