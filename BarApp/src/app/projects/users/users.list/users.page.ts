import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { TableColumn, TableData } from "@common-ui/table/table.component";
import { LoginService } from "@common/services/login.service";
import { UserService } from "src/app/projects/services/user.service";

@Component({
  selector: "app-admin-users",
  templateUrl: "./users.page.html",
  styleUrls: ["./users.page.scss"],
  providers: [UserService, Router],
})

export class UsersPage {
  columns: TableColumn[] = []

  data: TableData[] = [];

  isLoading = false;

  constructor(private usersService: UserService, private router: Router) {}

  ngOnInit() {
    this.columns = [{
      key: 'id',
      label: 'ID',
    }, {
      key: 'name',
      label: 'Nombre',
    },
    {
      key: 'baja',
      label: 'Estado',
      formatter: (data) => !data.baja ? 'Activo' : 'Eliminado'
    },
    {
      key: 'tel',
      label: 'Telefono',
    },
    {
      key: '',
      label: 'Eliminar',
      action: (params) => this.eliminarUsuario(params),
      hideAction: this.ocultarAccion,
    },
    { key: '',
      label: 'Editar',
      action: (params) => this.editarUsuario(params),
    }] as TableColumn[];

    this.isLoading = true;

    this.usersService.getUsers().subscribe((response) => {
      this.data = response.results as unknown as TableData[];
      this.isLoading = false;
    })
  }

  ocultarAccion(user: TableData) {
    return !!user['baja'];
  }

  eliminarUsuario(user: TableData) {
    this.usersService.deleteUsers(user['id'] as string).subscribe(() => {
      const idx = this.data.findIndex(u=> u['id'] === user['id']);
      if(idx!==-1){
        this.data.splice(idx,1,{...user, status: 'Eliminado'})
      }
    })
  }

  agregarUsuario() {
    this.router.navigate(['/add']);
  }

  editarUsuario(user: TableData){
    this.router.navigate(['/edit/', user['id']])
  }
}