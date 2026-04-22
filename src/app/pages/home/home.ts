import { Component, inject, ViewChild } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../shared/material-imports';
import { Footer } from '../../layout/footer/footer';
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { AuthService } from '../../service/authService';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-home',
  imports: [...MATERIAL_IMPORTS, Footer, RouterOutlet, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  authService = inject(AuthService);
  router = inject(Router);
  @ViewChild('sidenav') sidenav?: MatSidenav;
  isLoggedIn = this.authService.isLoggedIn();

  [x: string]: any;
  opened = true;

  menuItems = [
    { icon: 'home', label: 'Inicio', route: '/dashboard' },
    { icon: 'home', label: 'Categoria', route: '/listaCategorias' },
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'shopping_cart', label: 'Pedidos', route: '/pedidos' },
    { icon: 'settings', label: 'Configuración', route: '/configuracion' },
  ];

  toggleMenu(): void {
    if (this.authService.isLoggedIn()) {
      this.sidenav?.toggle();
    }
  }
  closeMenu(): void {
    this.sidenav?.close();
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/login']), { replaceUrl: true };
  }
}
