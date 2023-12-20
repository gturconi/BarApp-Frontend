import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProductsRoutingModule } from "./products-routing.module";
import { ProductsFormComponent } from "./products.form/products.form.component";
import { ProductsListComponent } from "./products.list/products.list.component";
import { CommonUiModule } from "@common-ui/common-ui.module";
import { ProductsComponent } from "./products/products.component";

@NgModule({
  declarations: [
    ProductsFormComponent,
    ProductsListComponent,
    ProductsComponent,
  ],
  imports: [CommonModule, ProductsRoutingModule, CommonUiModule],
})
export class ProductsModule {}
