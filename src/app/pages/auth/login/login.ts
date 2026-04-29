import { Component, inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../shared/material-imports';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/authService';
import { LoginModel } from '../../../models/loginModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',

  // Importaciones necesarias para que el componente standalone funcione
  imports: [
    ...MATERIAL_IMPORTS,
    ReactiveFormsModule,
    CommonModule
  ],

  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  // Inyección del Router para redireccionar después del login
  private router = inject(Router);

  // Inyección de FormBuilder para crear formularios reactivos
  private fb = inject(FormBuilder);

  // Inyección del servicio de autenticación
  private authService = inject(AuthService);

  // Formulario reactivo del login
  loginForm = this.fb.group({
    // Usuario obligatorio
    userName: ['', [Validators.required]],

    // Contraseña obligatoria con mínimo 6 caracteres
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // Método que se ejecuta al hacer login
  login(): void {

    // Validamos que el formulario esté correcto antes de enviarlo
    if (this.loginForm.invalid) {
      console.warn('Formulario inválido');

      // Marca todos los campos como tocados para mostrar errores en el HTML
      this.loginForm.markAllAsTouched();

      return;
    }

    // Obtenemos los datos del formulario
    const datos = this.loginForm.getRawValue() as LoginModel;

    // Llamamos al servicio de login
    this.authService.login(datos).subscribe({
      next: (response) => {

        // Obtenemos el body de la respuesta
        const body = response.body;

        // Validamos que exista body antes de guardar la sesión
        if (!body) {
          console.error('No se recibió body en la respuesta');
          return;
        }

        // Obtenemos el token
        // Primero intentamos leerlo desde los headers
        // Si no viene en headers, intentamos leerlo desde el body
        const token =
          response.headers.get('token') ||
          response.headers.get('Authorization') ||
          response.headers.get('authorization') ||
          body.token;

        console.log('Token recibido:', token);
        console.log('Body recibido:', body);

        // Validamos que sí exista token
        // Si no hay token, el guard no va a dejar entrar al dashboard
        if (!token) {
          console.error('No se recibió token');
          return;
        }

        // Guardamos la sesión en el servicio
        this.authService.saveSession(body, token);

        // Redireccionamos al dashboard
        // replaceUrl evita que el usuario vuelva al login con el botón atrás
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      },

      error: (error) => {
        // Manejo de errores del login
        console.error('Error completo:', error);
        console.error('Status:', error.status);
        console.error('Body del error:', error.error);
        console.error('Mensaje:', error.error?.message);
        console.error('Errores:', JSON.stringify(error.error?.errors, null, 2));
      }
    });
  }
}