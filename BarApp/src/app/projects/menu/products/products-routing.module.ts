import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsComponent } from './products/products.component';
import { ProductsListComponent } from './products.list/products.list.component';
import { ProductsFormComponent } from './products.form/products.form.component';
import { ProductsDetailsComponent } from './products-details/products-details.component';

import { authGuard } from '@common/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      { path: '', component: ProductsListComponent },
      {
        path: 'edit/:id',
        component: ProductsFormComponent,
        canActivate: [authGuard],
      },
      {
        path: 'add',
        component: ProductsFormComponent,
        canActivate: [authGuard],
      },
      { path: 'details/:idProd', component: ProductsDetailsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
