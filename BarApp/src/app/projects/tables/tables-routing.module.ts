import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablesComponent } from './tables/tables.component';
import { TablesListComponent } from './tables.list/tables.list.component';
import { TablesFormComponent } from './tables.form/tables.form.component';
import { adminGuard, authGuard } from '@common/guards';

const routes: Routes = [
  {
    path: '',
    component: TablesComponent,
    children: [
      {
        path: '',
        component: TablesListComponent,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'edit/:id',
        component: TablesFormComponent,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'add',
        component: TablesFormComponent,
        canActivate: [authGuard, adminGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule {}
