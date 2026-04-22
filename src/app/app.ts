import { Component, signal } from '@angular/core';
import { MATERIAL_IMPORTS } from './shared/material-imports';
import { Home } from './pages/home/home';

@Component({
  selector: 'app-root',
  imports: [...MATERIAL_IMPORTS, Home],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('inaApp');
}
