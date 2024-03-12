import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { CommonUiModule } from '@common-ui/common-ui.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from './services/user.service';
import { IonicModule } from '@ionic/angular';
import { UserComponent } from './user/user.component';
import { UserFormComponent } from './user.form/user.form.component';
import { UserListComponent } from './user.list/user.list.component';

@NgModule({
  declarations: [UserComponent, UserFormComponent, UserListComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    CommonUiModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  providers: [UserService],
})
export class UsersModule {}
