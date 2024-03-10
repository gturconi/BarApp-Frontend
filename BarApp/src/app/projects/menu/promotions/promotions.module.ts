import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonUiModule } from '@common-ui/common-ui.module';
import { IonicModule } from '@ionic/angular';

import { PromotionsRoutingModule } from './promotions-routing.module';
import { PromotionsComponent } from './promotions/promotions.component';
import { PromotionsDetailsComponent } from './promotions.details/promotions-details.component';
import { PromotionsFormComponent } from './promotions.form/promotions-form.component';

@NgModule({
  declarations: [
    PromotionsComponent,
    PromotionsDetailsComponent,
    PromotionsFormComponent,
  ],
  imports: [CommonModule, CommonUiModule, PromotionsRoutingModule, IonicModule],
})
export class PromotionsModule {}
