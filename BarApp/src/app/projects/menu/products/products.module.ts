import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonUiModule } from '@common-ui/common-ui.module';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsFormComponent } from './products.form/products.form.component';
import { ProductsListComponent } from './products.list/products.list.component';
import { ProductsComponent } from './products/products.component';
import { ProductsDetailsComponent } from './products-details/products-details.component';

import { ProductsService } from './services/products.service';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    ProductsFormComponent,
    ProductsListComponent,
    ProductsComponent,
    ProductsDetailsComponent,
  ],
  imports: [CommonModule, ProductsRoutingModule, CommonUiModule, IonicModule],
  providers: [ProductsService],
})
export class ProductsModule {}
