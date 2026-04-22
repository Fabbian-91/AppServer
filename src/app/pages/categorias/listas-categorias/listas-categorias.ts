import { Component, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Categoria } from '../../../models/categoria.model';
import { CategoriaService } from '../../../service/categoria-service';
import { MATERIAL_IMPORTS } from '../../../shared/material-imports';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-listas-categorias',
  imports: [...MATERIAL_IMPORTS],
  templateUrl: './listas-categorias.html',
  styleUrl: './listas-categorias.scss',
})
export class ListasCategorias implements OnInit, AfterViewInit {
  categorias: Categoria[] = [];
  private categoriaService = inject(CategoriaService);
  displayedColumns: string[] = ['id', 'nombre', 'acciones'];
  dataSource = new MatTableDataSource<Categoria>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadCategoria();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCategoria(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (resp) => {
        this.categorias = resp.data;
        this.dataSource.data = resp.data;
        console.log('Categorias guardadas', resp.data);
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}