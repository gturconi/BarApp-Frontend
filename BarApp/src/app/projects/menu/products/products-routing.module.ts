import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ProductsComponent } from "./products/products.component";
import { ProductsListComponent } from "./products.list/products.list.component";
import { ProductsFormComponent } from "./products.form/products.form.component";

import { authGuard } from "@common/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: ProductsComponent,
    children: [
      { path: "", component: ProductsListComponent },
      {
        path: "edit/:id",
        component: ProductsFormComponent,
        canActivate: [authGuard],
      },
      {
        path: "add/:id",
        component: ProductsFormComponent,
        canActivate: [authGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
