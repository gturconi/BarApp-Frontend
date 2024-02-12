import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrderComponent } from './order/order.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';

const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
    children: [
      {
        path: '',
        redirectTo: 'my-orders',
        pathMatch: 'full',
      },
      { path: 'my-orders', component: MyOrdersComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
