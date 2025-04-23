import { Injectable } from '@angular/core';
import { enviroment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/Cliente.model';

@Injectable({
  providedIn: 'root'
})
export class PrincipalService {

  private apiUrl:string = enviroment.apiUrl + 'principal/';



}
