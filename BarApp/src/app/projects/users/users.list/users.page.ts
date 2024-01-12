import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { TableColumn, TableData } from "@common-ui/table/table.component";
import { LoadingService } from "@common/services/loading.service";
import { UserService } from "src/app/projects/services/user.service";

@Component({
  selector: "app-admin-users",
  templateUrl: "./users.page.html",
  styleUrls: ["./users.page.scss"],
  providers: [UserService, Router],
})
export class UsersPage {
  columns: TableColumn[] = [];

  data: TableData[] = [];

  isLoading!: any;
  loading = false;

  totalPages: number = 1;

  pageSize: number = 10;

  pageIndex: number = 1;

  constructor(
    private usersService: UserService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  async ngOnInit() {
    this.columns = [
      {
        key: "id",
        label: "ID",
      },
      {
        key: "name",
        label: "Nombre",
      },
      {
        key: "baja",
        label: "Estado",
        formatter: data => (!data.baja ? "Activo" : "Eliminado"),
      },
      {
        key: "tel",
        label: "Telefono",
      },
      {
        key: "",
        label: "Eliminar",
        action: params => this.eliminarUsuario(params),
        hideAction: this.ocultarAccion,
      },
      {
        key: "",
        label: "Editar",
        action: params => this.editarUsuario(params),
      },
    ] as TableColumn[];

    this.loading = true;
    this.isLoading = await this.loadingService.loading();
    await this.isLoading.present();
    this.doSearch();
  }

  getContainerClasses(): string {
    return this.isLoading || !this.data.length
      ? "usersListContainer fullHeight"
      : "usersListContainer";
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
    return !!user["baja"];
  }

  eliminarUsuario(user: TableData) {
    this.usersService.deleteUsers(user["id"] as string).subscribe(() => {
      const idx = this.data.findIndex(u => u["id"] === user["id"]);
      if (idx !== -1) {
        this.data.splice(idx, 1, { ...user, status: "Eliminado" });
      }
    });
  }

  agregarUsuario() {
    this.router.navigate(["/add"]);
  }

  editarUsuario(user: TableData) {
    this.router.navigate(["/edit/", user["id"]]);
  }

  async filtrarUsuarios(value: string) {
    this.isLoading = await this.loadingService.loading();
    this.loading = true;
    await this.isLoading.present();
    this.usersService
      .getUsers(undefined, undefined, value)
      .subscribe(response => {
        this.data = response.results as unknown as TableData[];
        this.isLoading.dismiss();
        this.loading = false;
      });
  }
}
