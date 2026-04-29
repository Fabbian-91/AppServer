import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../shared/material-imports';

@Component({
  selector: 'app-footer',

  // Importamos Material porque usamos mat-toolbar, mat-icon y botones
  imports: [
    ...MATERIAL_IMPORTS
  ],

  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer { }
