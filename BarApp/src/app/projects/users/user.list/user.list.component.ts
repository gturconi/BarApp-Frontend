import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumn, TableData } from '@common-ui/table/table.component';
import { UserService } from '../services/user.service';
import { LoadingService } from '@common/services/loading.service';
import { DELETE_OPTS } from '@common/constants/messages.constant';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-users',
  templateUrl: './user.list.component.html',
})
export class UserListComponent {
  columns: TableColumn[] = [];

  data: TableData[] = [];

  isLoading!: any;
  loading = false;

  totalPages: number = 1;

  pageSize: number = 10;

  pageIndex: number = 1;

  filtro: string = '';

  constructor(
    private usersService: UserService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  async ngOnInit() {
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

    this.loading = true;
    this.isLoading = await this.loadingService.loading();
    await this.isLoading.present();
    this.doSearch();
  }

  doSearch(): void {
    this.usersService
      .getUsers(this.pageIndex, this.pageSize)
      .subscribe(response => {
        this.data = response.results as unknown as TableData[];
        this.isLoading.dismiss();
        this.loading = false;
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

  async eliminarUsuario(user: TableData) {
    Swal.fire(DELETE_OPTS).then(async result => {
      if (result.isConfirmed) {
        const loading = await this.loadingService.loading();
        await loading.present();
        this.usersService.deleteUsers(user['id'] as string).subscribe(() => {
          const idx = this.data.findIndex(u => u['id'] === user['id']);
          if (idx !== -1) {
            this.data.splice(idx, 1, { ...user, baja: 1 });
          }
          loading.dismiss();
          this.doSearch();
        });
      }
    });
  }

  editarUsuario(user: TableData) {
    this.router.navigate(['users/edit/', user['id']]);
  }

  agregarUsuario() {
    this.router.navigate(['/users/add']);
  }

  filtrarUsuarios(value: string) {
    if (!value) {
      this.doSearch();
    } else {
      this.filtro = value;
    }
  }

  async busquedaFiltrada() {
    this.isLoading = await this.loadingService.loading();
    this.isLoading.present();
    this.usersService
      .getUsers(undefined, undefined, this.filtro)
      .subscribe(response => {
        this.data = response.results as unknown as TableData[];
        this.isLoading.dismiss();
      });
  }
}
