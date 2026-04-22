import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginModel, LoginResponse } from '../models/loginModel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Inyectamos HttpClient para hacer peticiones HTTP
  private http = inject(HttpClient);

  // Inyectamos PLATFORM_ID para saber si estamos en navegador
  private platformId = inject(PLATFORM_ID);

  // URL base del backend
  private apiUrl = 'http://localhost:3000/api/auth';

  // Signal que guarda el token actual
  // Lo iniciamos en null para evitar error con localStorage en SSR/Vite
  /* private tokenSignal = signal<string | null>(null); */


  /* constructor() {
    // Solo usamos localStorage si estamos en navegador
    if (isPlatformBrowser(this.platformId)) {
      this.tokenSignal.set(localStorage.getItem('token'));
    }
  } */

  //Saber si esta logueado
  private tokenSignal = signal<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  );


  // Computed que indica si el usuario está logueado hace que las variables sean reactivas
  // Si hay token, devuelve true
  isLoggedIn = computed(() => !!this.tokenSignal());//Los dobles !! covierte un el this.tokenSignal en una expresion booleana



  // Hacemos login
  // observe: 'response' hace que Angular devuelva toda la respuesta,
  // incluyendo headers, status y body
  login(datos: LoginModel): Observable<HttpResponse<LoginResponse>> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, datos, {
      observe: 'response',
    });
  }

  // Guardamos la sesión del usuario
  // Recibimos el body por un lado y el token por otro
  saveSession(body: LoginResponse, token: string | null): void {
    if (isPlatformBrowser(this.platformId)) {
      // Si vino token en el header, lo guardamos
      if (token) {
        localStorage.setItem('token', token);
      }

      // Guardamos otros datos útiles del usuario
      localStorage.setItem('usuario', body.user.id.toString());
      localStorage.setItem('rol', body.role);
    }

    // Actualizamos la signal con el token actual
    this.tokenSignal.set(token);
  }

  // Cerramos sesión
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      localStorage.removeItem('rol');
    }

    this.tokenSignal.set(null);
  }

  // Devuelve el token actual
  getToken(): string | null {
    return this.tokenSignal();
  }

  // Devuelve el id del usuario guardado
  getUsuario(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('usuario');
    }
    return null;
  }
}