import { Component, inject, OnInit } from '@angular/core';
import { getAllCliente } from '../../models/cliente.model';
import { Cliente } from '../../service/cliente';
import { MatTableDataSource} from '@angular/material/table';
import { MATERIAL_IMPORTS } from '../../shared/material-imports';

@Component({
  selector: 'app-cliente-lista',
  imports: [...MATERIAL_IMPORTS],
  templateUrl: './cliente-lista.html',
  styleUrl: './cliente-lista.scss',
})
export class ClienteLista implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'correo','apellidos' ,'symbol'];
  dataSource = new MatTableDataSource<getAllCliente>([]);

  clientes!: getAllCliente[];
  mensaje!: string;
  clienteService = inject(Cliente);

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clienteService.getCliente().subscribe({
      next: (response) => {
        this.clientes = response.data;
        this.mensaje = response.message;
        console.log(this.clientes);
        console.log(this.mensaje);
      },
      error: (error) => {
        console.log('Error de tipo', error);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
