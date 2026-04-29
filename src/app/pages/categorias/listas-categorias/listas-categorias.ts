import { Component, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Categoria } from '../../../models/categoria.model';
import { CategoriaService } from '../../../service/categoria-service';
import { MATERIAL_IMPORTS } from '../../../shared/material-imports';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CategoriaForm } from '../categoria-form/categoria-form';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listas-categorias',
  imports: [...MATERIAL_IMPORTS],
  templateUrl: './listas-categorias.html',
  styleUrl: './listas-categorias.scss',
})
export class ListasCategorias implements OnInit, AfterViewInit {

  //injeccion de dependencias
  private categoriaService = inject(CategoriaService);
  private dialog = inject(MatDialog);
  private toastr = inject(ToastrService);

  categorias: Categoria[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'acciones'];
  dataSource = new MatTableDataSource<Categoria>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Categoria>;



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
        this.dataSource.data = resp.data ?? [];
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

  //Acepta una categoria o un valor nulo, un valor nulo cuando se va crear o categoria cuando se va modificar
  crearModificarCategoria(categoria: Categoria | null, isMod: boolean): void {
    const dialogRef = this.dialog.open(CategoriaForm, {
      //Pasarle atributos al dialogo
      width: '600px',
      height: '800px',
      data: { categoria, isModificar: isMod },//puede pasar datos si es necesario
    });

    dialogRef.afterClosed().subscribe((result) => {
      //Validar que la categoria no es indefinida
      if (!result) {
        return;
      }

      //Mandar actualizar
      if (isMod && categoria?.id) {
        this.categoriaService.modificarCategoria(categoria.id, {
          nombre: result.nombre,
          descripcion: result.descripcion
        } as Categoria).subscribe({
          next: () => { this.loadCategoria(), this.toastr.success('Categoria actualizada con exito'); },
          error: (error) => console.error('Error al actualizar la categoría:', error)
        });
      } else {
        //Mandar a crear
        this.categoriaService.createCategoria({
          nombre: result.nombre,
          descripcion: result.descripcion
        } as Categoria).subscribe({
          next: () => {
            this.toastr.success('Categoria creada con exito');
            this.loadCategoria()
          },
          error: (error) => console.error('Error al crear la categoría:', error)
        });
      }
    })
  }

  eliminarCategoria(cat: Categoria): void {

    if (confirm(`¿Estás seguro de eliminar la categoría "${cat.nombre}"?`)) {
      this.categoriaService.eliminarCategorias(cat.id).subscribe({
        next: () => {
          console.log('Categoría eliminada');
          this.loadCategoria(); // Recargar la lista después de eliminar
          this.toastr.success('Categoria eliminada con exito');
        },

        error: (error) => {
          console.error('Error al eliminar la categoría:', error);
        },

      });
    }
  }
}