import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../../../service/usuario-service';
import { Usuario } from '../../../models/usuario.model';
import { MATERIAL_IMPORTS } from '../../../shared/material-imports';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsuarioForm } from '../usuario-form/usuario-form';
import { error } from 'console';


@Component({
  selector: 'app-lista-usuario',
  imports: [...MATERIAL_IMPORTS],
  templateUrl: './lista-usuario.html',
  styleUrl: './lista-usuario.scss',
})
export class ListaUsuario implements OnInit {

  //Inject del servicio
  private usuarioService = inject(UsuarioService);
  private dialog = inject(MatDialog);
  private toastr = inject(ToastrService);
  userName: string = '';
  password: string = '';
  role: string = '';

  //Data source tipo usuario y recibe un arreglo
  dataSource = new MatTableDataSource<Usuario>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Usuario>;

  //Arreglo de columnas de usuario
  displayedColumns: string[] = [
    'id',
    'userName',
    'role',
    'estado',
    'acciones'
  ];


  //Cuando cargue la pagina listar usuarios
  ngOnInit(): void {
    this.loadUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //listar Usuarios
  loadUsuarios(): void {
    this.usuarioService.getUsuario().subscribe({
      next: (resp) => {
        this.dataSource.data = resp.data;
      },
      error: (error) => {
        console.error("Erro de Usuarios", error)
      }
    });
  }

  crearModificarUsuario(usuario: Usuario | null, isMod: boolean): void {
    const dialogRef = this.dialog.open(UsuarioForm, {
      width: '600px',
      height: '650px',
      data: { usuario, isModificar: isMod },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      if (isMod && usuario?.id) {
        this.usuarioService.patchUsuario(usuario.id, result).subscribe({
          next: (resp) => {
            this.toastr.success(resp.message);
            this.loadUsuarios();
          },
          error: (error) => {
            console.error(error);
            this.toastr.error('Error al actualizar usuario');
          }
        });
      } else {
        this.usuarioService.postUsuario(result).subscribe({
          next: (resp) => {
            this.toastr.success(resp.message);
            this.loadUsuarios();
          },
          error: (err) => {
            console.log('ERROR COMPLETO:', err);
            console.log('ERROR BODY:', err.error);
            console.log('DETALLES:', err.error?.errors?.[0]?.details);
            this.toastr.error('Error al crear usuario');
          }
        });
      }
    });
  }

  eliminarUsuario(u: Usuario): void {
    if (u.id === undefined || u.id === null) {
      this.toastr.error('El usuario no tiene ID');
      return;
    }

    if (confirm(`¿Estás seguro de eliminar el usuario "${u.userName}"?`)) {
      this.usuarioService.deleteUsuario(u.id).subscribe({
        next: (resp) => {
          this.loadUsuarios();
          this.toastr.success(resp.message || 'Usuario eliminado con éxito');
        },
        error: (error) => {
          console.error('Error al eliminar el usuario', error);
          this.toastr.error('Error al eliminar usuario');
        },
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
