import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonUiModule } from '@common-ui/common-ui.module';

import { OrderRoutingModule } from './order-routing.module';
import { IonicModule } from '@ionic/angular';

import { OrderComponent } from './order/order.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { ConfirmedOrdersComponent } from './confirmed-orders/confirmed-orders.component';
import { BarcodeScanningModalComponent } from './my-orders/barcode-scanning-modal.component';
import { OrderDetailsComponent } from './order.details/order.details.component';

@NgModule({
  declarations: [
    OrderComponent,
    MyOrdersComponent,
    OrderDetailsComponent,
    ConfirmedOrdersComponent,
    BarcodeScanningModalComponent,
  ],
  imports: [CommonModule, OrderRoutingModule, CommonUiModule, IonicModule],
})
export class OrderModule {}
