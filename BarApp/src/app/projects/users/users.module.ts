import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { CommonUiModule } from '@common-ui/common-ui.module';
import { UsersPageRoutingModule } from './users-routing.module';
import { UsersPage } from './users.list/users.page';
import { UserEditPage } from './edit.component/edit.page';
import { UsersComponent } from './users/users.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    UsersPageRoutingModule,
    CommonUiModule,
  ],
  declarations: [UsersPage, UserEditPage, UsersComponent],
})
export class UsersPageModule {}
