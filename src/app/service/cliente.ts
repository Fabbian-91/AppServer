import { inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviorment } from '../../enviormets';
import { Observable } from 'rxjs';
import { clienteApiResponse } from '../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class Cliente {
  private http=inject(HttpClient);
  private URL=`${enviorment.apiUrl}${enviorment.endpoints.clientes}`;

  getCliente():Observable<clienteApiResponse>{
    return this.http.get<clienteApiResponse>(this.URL);
  }
}
