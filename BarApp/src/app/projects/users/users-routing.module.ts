import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UsersPage } from "./users.list/users.page";
import { UserEditPage } from "./edit.component/edit.page";

const routes: Routes = [
  {
    path: "",
    component: UsersPage,
  },
  {
    path: "edit/:id", 
    component: UserEditPage, 
    /*A veces tengo problemas en el ruteo, tanto para editar como para agregar un nuevo usuario
    la verdad no se por que, lo unico q se me ocurre es q a veces me quede cacheado 
    */
  },
  {
    path: "add",
    component: UserEditPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersPageRoutingModule {}
