import { Routes } from '@angular/router';
import { authGuard } from './guard/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login').then((m) => m.Login)
  },

  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.Home),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((m) => m.Dashboard)
      },
      {
        path: 'listaCategorias',
        loadComponent: () =>
          import('./pages/categorias/listas-categorias/listas-categorias').then((m) => m.ListasCategorias)
      },
      {
        path: 'listaUsuarios',
        loadComponent: () =>
          import('./pages/usuario/lista-usuario/lista-usuario').then((m) => m.ListaUsuario)
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];