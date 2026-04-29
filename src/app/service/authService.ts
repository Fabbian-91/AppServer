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
  // Si estamos en navegador, intenta cargar el token guardado en localStorage
  // Si no estamos en navegador, inicia en null para evitar errores
  private tokenSignal = signal<string | null>(
    isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null
  );

  // Computed que indica si el usuario está logueado
  // Si hay token en la signal, devuelve true
  // Si la signal está vacía, revisa localStorage como respaldo
  isLoggedIn = computed(() => {
    const token = this.tokenSignal();

    // Si la signal tiene token, el usuario está logueado
    if (token) {
      return true;
    }

    // Si estamos en navegador, revisamos si hay token guardado en localStorage
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }

    // Si no hay token, no está logueado
    return false;
  });

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

    // Solo usamos localStorage si estamos en navegador
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Obtenemos el token final
    // Primero usamos el token recibido por parámetro
    // Si no viene ahí, intentamos tomarlo del body
    // Si tampoco viene, usamos el que ya esté guardado en localStorage
    const tokenFinal =
      token ||
      body.token ||
      localStorage.getItem('token');

    // Si no hay token, no podemos guardar sesión
    if (!tokenFinal) {
      console.error('No se recibió token para guardar sesión');
      return;
    }

    // Guardamos el token en localStorage
    localStorage.setItem('token', tokenFinal);

    // Guardamos otros datos útiles del usuario
    localStorage.setItem('usuario', body.user.id.toString());
    localStorage.setItem('rol', body.role);

    // Actualizamos la signal con el token final
    // Esto hace que isLoggedIn devuelva true inmediatamente
    this.tokenSignal.set(tokenFinal);
  }

  // Cerramos sesión
  logout(): void {

    // Solo usamos localStorage si estamos en navegador
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      localStorage.removeItem('rol');
    }

    // Limpiamos la signal
    this.tokenSignal.set(null);
  }

  // Devuelve el token actual
  getToken(): string | null {

    // Primero intentamos obtener el token desde la signal
    const token = this.tokenSignal();

    // Si existe en la signal, lo devolvemos
    if (token) {
      return token;
    }

    // Si estamos en navegador, intentamos obtenerlo desde localStorage
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }

    // Si no existe token, devolvemos null
    return null;
  }

  // Devuelve el id del usuario guardado
  getUsuario(): string | null {

    // Solo usamos localStorage si estamos en navegador
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('usuario');
    }

    return null;
  }
}