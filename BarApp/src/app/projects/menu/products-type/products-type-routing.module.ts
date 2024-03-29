import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '@common/guards/auth.guard';

import { ProductsTypeComponent } from './products-type/products-type.component';
import { ProductsTypeListComponent } from './products-type.list/products-type.list.component';
import { ProductsTypeFormComponent } from './products-type.form/products-type.form.component';
import { PromotionsFormComponent } from '../promotions/promotions.form/promotions-form.component';
import { adminGuard } from '@common/guards';

const routes: Routes = [
  {
    path: '',
    component: ProductsTypeComponent,
    children: [
      { path: '', component: ProductsTypeListComponent },
      {
        path: 'edit/:id',
        component: ProductsTypeFormComponent,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'add',
        component: ProductsTypeFormComponent,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'addPromotion',
        component: PromotionsFormComponent,
        canActivate: [authGuard],
      },
      {
        path: 'editPromotion/:idPromotion',
        component: PromotionsFormComponent,
        canActivate: [authGuard],
      },
      {
        path: ':idCat/products',
        loadChildren: () =>
          import('../products/products.module').then(m => m.ProductsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsTypeRoutingModule {}
