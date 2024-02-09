import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CommonUiModule } from "@common-ui/common-ui.module";
import { FormsModule } from "@angular/forms";

import { ProductsTypeRoutingModule } from "./products-type-routing.module";
import { ProductsTypeListComponent } from "./products-type.list/products-type.list.component";
import { ProductsTypeFormComponent } from "./products-type.form/products-type.form.component";
import { ProductsTypeComponent } from "./products-type/products-type.component";

import { ProductsTypeService } from "./services/products-type.service";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [
    ProductsTypeListComponent,
    ProductsTypeFormComponent,
    ProductsTypeComponent,
  ],
  imports: [
    CommonModule,
    CommonUiModule,
    ProductsTypeRoutingModule,
    IonicModule,
    FormsModule
  ],
  providers: [ProductsTypeService],
})
export class ProductsTypeModule {}
