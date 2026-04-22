import { Component, inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../shared/material-imports';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/authService';
import { LoginModel } from '../../../models/loginModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [...MATERIAL_IMPORTS, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private router = inject(Router);
  // Inyectamos FormBuilder para construir el formulario reactivo
  private fb = inject(FormBuilder);

  // Inyectamos el servicio de autenticación
  private authService = inject(AuthService);

  // Definimos el formulario de login
  loginForm = this.fb.group({
    // Campo del usuario
    // Si realmente vas a usar userName, no conviene validar como email
    userName: ['', [Validators.required]],

    // Campo contraseña
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  login(): void {
    // Verificamos que el formulario sea válido antes de enviarlo
    if (this.loginForm.valid) {
      // Convertimos el valor del formulario al modelo LoginModel
      const datos = this.loginForm.value as LoginModel;

      // Llamamos al servicio de login
      // Ojo: el servicio debe tener observe: 'response'
      // para poder leer headers + body
      this.authService.login(datos).subscribe({
        next: (response) => {
          // Leemos el token desde el header llamado "token"
          const token = response.headers.get('token');

          // Leemos el body de la respuesta
          const body = response.body;

          console.log('Token recibido desde header:', token);
          console.log('Body recibido:', body);

          // Si el body existe, guardamos la sesión
          if (body) {
            this.authService.saveSession(body, token);
            //Redirección a la pagina de inicio o dashboard
            this.router.navigate(['/dashboard'], { replaceUrl: true });//davegar y que el replace para que no pueda volver a la anterior
          } else {
            console.error('No se recibió body en la respuesta');
          }
        },
        error: (error) => {
          console.error('Error completo:', error);
          console.error('Status:', error.status);
          console.error('Body del error:', error.error);
          console.error('Mensaje:', error.error?.message);
          console.error('Errores:', JSON.stringify(error.error?.errors, null, 2));
        }
      });
    } else {
      console.warn('Formulario inválido');
      this.loginForm.markAllAsTouched();
    }
  }
}