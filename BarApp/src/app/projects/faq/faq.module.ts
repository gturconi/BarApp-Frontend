import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FaqComponent } from './faq-component/faq.component';
import { FaqRoutingModule } from './faq-routing.module';

@NgModule({
  declarations: [FaqComponent],
  imports: [CommonModule, FaqRoutingModule, IonicModule],
  exports: [FaqComponent],
})
export class FaqModule {}
