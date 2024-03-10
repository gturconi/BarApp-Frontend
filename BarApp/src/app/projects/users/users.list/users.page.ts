import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumn, TableData } from '@common-ui/table/table.component';
import { UserService } from 'src/app/projects/services/user.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  providers: [UserService, Router],
})
export class UsersPage {
  columns: TableColumn[] = [];

  data: TableData[] = [];

  isLoading = false;

  totalPages: number = 1;

  pageSize: number = 3;

  pageIndex: number = 1;

  filtro: string = '';

  constructor(private usersService: UserService, private router: Router) {}

  ngOnInit() {
    this.columns = [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'name',
        label: 'Nombre',
      },
      {
        key: 'baja',
        label: 'Estado',
        formatter: data => (!data.baja ? 'Activo' : 'Eliminado'),
      },
      {
        key: 'tel',
        label: 'Telefono',
      },
      {
        key: 'role',
        label: 'Rol',
      },
      {
        key: '',
        label: 'Eliminar',
        action: params => this.eliminarUsuario(params),
        hideAction: this.ocultarAccion,
        actionClass: 'table-red-button',
      },
      {
        key: '',
        label: 'Editar',
        action: params => this.editarUsuario(params),
        actionClass: 'table-blue-button',
      },
    ] as TableColumn[];

    this.isLoading = true;
    this.doSearch();
  }

  doSearch(): void {
    this.usersService
      .getUsers(this.pageIndex, this.pageSize)
      .subscribe(response => {
        this.data = response.results as unknown as TableData[];
        this.isLoading = false;
        this.totalPages = response.totalPages;
      });
  }

  onPageChanged(e: number): void {
    this.pageIndex = e;
    this.doSearch();
  }

  ocultarAccion(user: TableData) {
    return !!user['baja'];
  }

  eliminarUsuario(user: TableData) {
    this.usersService.deleteUsers(user['id'] as string).subscribe(() => {
      const idx = this.data.findIndex(u => u['id'] === user['id']);
      if (idx !== -1) {
        this.data.splice(idx, 1, { ...user, baja: 1 });
      }
    });
  }

  agregarUsuario() {
    this.router.navigate(['/add']);
  }

  editarUsuario(user: TableData) {
    this.router.navigate(['/edit/', user['id']]);
  }

  filtrarUsuarios(value: string) {
    if (!value) {
      this.doSearch();
    } else {
      this.filtro = value;
    }
  }

  busquedaFiltrada() {
    this.isLoading = true;
    this.usersService
      .getUsers(undefined, undefined, this.filtro)
      .subscribe(response => {
        this.data = response.results as unknown as TableData[];
        this.isLoading = false;
      });
  }
}
