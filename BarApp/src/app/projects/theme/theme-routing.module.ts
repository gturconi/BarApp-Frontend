import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ThemesComponent } from './themes/themes.component';
import { ThemesListComponent } from './themes.list/themes.list.component';
import { ThemesDetailsComponent } from './themes.details/themes.details.component';

import { authGuard } from '@common/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ThemesComponent,
    children: [
      { path: '', component: ThemesListComponent, canActivate: [authGuard] },
      {
        path: 'details/:id',
        component: ThemesDetailsComponent,
        canActivate: [authGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThemeRoutingModule {}
