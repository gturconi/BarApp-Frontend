import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PromotionsDetailsComponent } from './promotions.details/promotions-details.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { PromotionsFormComponent } from './promotions.form/promotions-form.component';

import { authGuard } from '@common/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PromotionsComponent,
    children: [
      {
        path: '',
        redirectTo: '/menu/categories',
        pathMatch: 'full',
      },
      {
        path: 'edit/:id',
        component: PromotionsFormComponent,
        canActivate: [authGuard],
      },
      {
        path: 'add',
        component: PromotionsFormComponent,
        canActivate: [authGuard],
      },
      { path: 'details/:idProm', component: PromotionsDetailsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotionsRoutingModule {}
