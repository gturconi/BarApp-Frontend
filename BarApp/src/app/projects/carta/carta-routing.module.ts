import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CartaComponent } from "./carta-component/carta.component";

const routes: Routes = [
  {
    path: "",
    component: CartaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartaRoutingModule { }
