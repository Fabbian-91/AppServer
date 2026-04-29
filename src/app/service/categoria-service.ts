import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { enviorment } from '../../enviormets';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private http = inject(HttpClient);
  private apiUrl = `${enviorment.apiUrl}${enviorment.endpoints.categorias}`;

  getCategorias(): Observable<{ message: string; data: Categoria[] }> {
    return this.http.get<{ message: string; data: Categoria[] }>(this.apiUrl);
  }

  getCategoriasById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  createCategoria(categoria: Categoria): Observable<Categoria> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ token: token })
    return this.http.post<Categoria>(this.apiUrl, categoria, { headers });
  }

  modificarCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ token: token })
    return this.http.patch<Categoria>(`${this.apiUrl}/${id}`, categoria, { headers });
  }

  eliminarCategorias(id: number): Observable<void> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ token: token })
    return this.http.delete<void>(`${this.apiUrl}/${id}`,{headers});
  }
}