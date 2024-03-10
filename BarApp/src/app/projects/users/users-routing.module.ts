import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersPage } from './users.list/users.page';
import { UserEditPage } from './edit.component/edit.page';
import { UsersComponent } from './users/users.component';
import { adminGuard, authGuard } from '@common/guards';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: '',
        component: UsersPage,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'add',
        component: UserEditPage,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'edit/:id',
        component: UserEditPage,
        canActivate: [authGuard, adminGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersPageRoutingModule {}
