import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviorment } from '../../enviormets';
import { Observable } from 'rxjs';
import { Usuario, usuarioApiResponse } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  //injection de dependencias del HttpClient
  private http = inject(HttpClient);
  //Url
  private URL = `${enviorment.apiUrl}${enviorment.endpoints.usuarios}`;

  /**
   * Metodo get para listar todo los usuarios
   * @returns 
   */
  getUsuario(): Observable<usuarioApiResponse> {
    return this.http.get<usuarioApiResponse>(this.URL);
  }

  postUsuario(u: Usuario): Observable<usuarioApiResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ token: token });
    return this.http.post<usuarioApiResponse>(this.URL, u, { headers })
  }

  patchUsuario(id: number, u: Partial<Usuario>): Observable<usuarioApiResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ token });
    return this.http.patch<usuarioApiResponse>(`${this.URL}/${id}`, u, { headers });
  }

  deleteUsuario(id: number): Observable<usuarioApiResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ token: token });
    return this.http.delete<usuarioApiResponse>(`${this.URL}/${id}`, { headers });
  }
}
