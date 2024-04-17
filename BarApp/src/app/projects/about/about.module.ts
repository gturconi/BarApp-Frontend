import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CommonUiModule } from '@common-ui/common-ui.module';

import { AboutComponent } from './about-component/about.component';
import { AboutRoutingModule } from './about-routing.module';
import { AboutComponentAdmin } from './about-component-admin/about.component.admin';
import { AboutRouteComponent } from './about-route/about.route.component';

@NgModule({
  declarations: [AboutRouteComponent, AboutComponent, AboutComponentAdmin],
  imports: [CommonModule, AboutRoutingModule, CommonUiModule, IonicModule],
  exports: [AboutRouteComponent],
})
export class AboutModule{}
