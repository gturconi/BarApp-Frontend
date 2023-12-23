import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";

import { CommonUiModule } from "@common-ui/common-ui.module";
import { UsersPageRoutingModule } from "./users-routing.module";
import { UsersPage } from "./users.list/users.page";
import { UserEditPage } from "./edit.component/edit.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersPageRoutingModule,
    CommonUiModule,
  ],
  declarations: [UsersPage, UserEditPage],
})
export class UsersPageModule {}
