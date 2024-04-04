import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrderComponent } from './order/order.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { authGuard } from '@common/guards/auth.guard';
import { ConfirmedOrdersComponent } from './confirmed-orders/confirmed-orders.component';

const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'my-orders', pathMatch: 'full' },
      { path: 'my-orders', component: MyOrdersComponent, pathMatch: 'full' },
      { path: 'my-orders/confirmed', component: ConfirmedOrdersComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
