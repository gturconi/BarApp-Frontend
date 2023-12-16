import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { IntroComponent } from './intro-component/intro.component';
import { IntroRoutingModule } from './intro-routing.module';


@NgModule({
  declarations: [IntroComponent],
  imports: [
    CommonModule,
    IntroRoutingModule,
    IonicModule
  ],
  exports: [IntroComponent],
})
export class IntroModule { }
