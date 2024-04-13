import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrderComponent } from './order/order.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { adminGuard, authGuard } from '@common/guards';
import { ConfirmedOrdersComponent } from './confirmed-orders/confirmed-orders.component';
import { OrderDetailsComponent } from './order.details/order.details.component';
import { OrderAdminListComponent } from './order.admin.list/order.admin.list.component';

const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: OrderAdminListComponent,
        canActivate: [authGuard, adminGuard],
      },
      // { path: '', redirectTo: 'my-orders', pathMatch: 'full' },
      { path: 'my-orders', component: MyOrdersComponent, pathMatch: 'full' },
      { path: 'my-orders/confirmed', component: ConfirmedOrdersComponent },
      {
        path: 'my-orders/confirmed/details/:idOrder',
        component: OrderDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
