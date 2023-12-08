import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartaComponent } from "./carta-component/carta.component";
import { IonicModule } from '@ionic/angular';

import { CartaRoutingModule } from './carta-routing.module';


@NgModule({
  declarations: [CartaComponent],
  imports: [
    CommonModule,
    CartaRoutingModule,
    IonicModule
  ],
  exports: [CartaComponent],
})
export class CartaModule { }
