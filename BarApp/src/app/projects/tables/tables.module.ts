import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonUiModule } from '@common-ui/common-ui.module';
import { TablesRoutingModule } from './tables-routing.module';
import { IonicModule } from '@ionic/angular';
import { QRCodeModule } from 'angularx-qrcode';
import { OrderModule } from '../order/order.module';

import { TablesComponent } from './tables/tables.component';
import { TablesFormComponent } from './tables.form/tables.form.component';
import { TablesListComponent } from './tables.list/tables.list.component';

import { TablesService } from './services/tables.service';

@NgModule({
  declarations: [TablesComponent, TablesFormComponent, TablesListComponent],
  imports: [
    CommonModule,
    CommonUiModule,
    TablesRoutingModule,
    IonicModule,
    QRCodeModule,
    OrderModule,
  ],
  providers: [TablesService],
})
export class TablesModule {}
