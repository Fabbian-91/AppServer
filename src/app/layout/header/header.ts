import { Component, EventEmitter, Output } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../shared/material-imports';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',

  // Importamos Material y RouterLink porque usamos routerLink en el HTML
  imports: [
    ...MATERIAL_IMPORTS,
    RouterLink
  ],

  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  // Evento que se emite cuando se presiona el botón del menú
  @Output() toggleMenu = new EventEmitter<void>();

  // Evento que se emite cuando se presiona salir
  @Output() logout = new EventEmitter<void>();
}
