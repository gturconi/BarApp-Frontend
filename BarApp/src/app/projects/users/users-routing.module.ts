import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { UserListComponent } from './user.list/user.list.component';
import { adminGuard, authGuard } from '@common/guards';
import { UserFormComponent } from './user.form/user.form.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        component: UserListComponent,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'add',
        component: UserFormComponent,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'edit/:id',
        component: UserFormComponent,
        canActivate: [authGuard, adminGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
