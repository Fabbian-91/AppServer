import { Routes } from '@angular/router';
import { authGuard } from './guard/auth-guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/auth/login/login').then((m) => m.Login) },
  { path: 'inicio', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'login', loadComponent: () => import('./pages/auth/login/login').then((m) => m.Login) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard) },
  { path: 'listaCategorias', loadComponent: () => import('./pages/categorias/listas-categorias/listas-categorias').then((m) => m.ListasCategorias), },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }

];
