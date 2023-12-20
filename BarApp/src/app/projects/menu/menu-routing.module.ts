import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IntroComponent } from "../intro/intro-component/intro.component";

const routes: Routes = [
  {
    path: "categories",
    loadChildren: () =>
      import("./products-type/products-type.module").then(
        m => m.ProductsTypeModule
      ),
  },
  {
    path: "",
    component: IntroComponent,
    pathMatch: "full",
  },
  { path: "**", component: IntroComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuRoutingModule {}
