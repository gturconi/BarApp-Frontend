import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumn, TableData } from '@common-ui/table/table.component';
import { UserService } from '../services/user.service';
import { LoadingService } from '@common/services/loading.service';
import { DELETE_OPTS } from '@common/constants/messages.constant';
import Swal from 'sweetalert2';
import { UserRole } from '@common/models/userRole';

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
        key: 'email',
        label: 'Email',
      },
      {
        key: 'name',
        label: 'Nombre',
      },
      {
        key: 'baja',
        label: 'Estado',
        formatter: data => (!data.baja ? 'Activo' : 'Inhabilitado'),
      },
      {
        key: 'tel',
        label: 'Telefono',
      },
      {
        key: 'role',
        label: 'Rol',
        formatter: data => UserRole.roleTranslations[data.role],
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
    if (this.filtro != '') {
      this.busquedaFiltrada();
    } else {
      this.doSearch();
    }
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
    if (value === '') {
      this.filtro = '';
      this.pageIndex = 1;
      this.doSearch();
    } else {
      this.filtro = value;
      this.busquedaFiltrada();
    }
  }

  async busquedaFiltrada() {
    this.isLoading = await this.loadingService.loading();
    this.isLoading.present();
    this.usersService
      .getUsers(this.pageIndex, this.pageSize, this.filtro)
      .subscribe(response => {
        this.data = response.results as unknown as TableData[];
        this.totalPages = response.totalPages;
        this.isLoading.dismiss();
      });
  }
}
