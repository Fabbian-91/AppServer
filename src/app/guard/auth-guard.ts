import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/authService';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const logged = authService.isLoggedIn();

  console.log('GUARD EJECUTADO');
  console.log('Ruta solicitada:', state.url);
  console.log('¿Está logueado?:', logged);
  console.log('Token:', localStorage.getItem('token'));

  if (!logged) {
    return router.createUrlTree(['/login']);
  }

  return true;
};