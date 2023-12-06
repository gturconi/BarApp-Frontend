import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { HomePage } from "./home.component/home.page";

import { HomePageRoutingModule } from "./home-routing.module";
import { CommonUiModule } from "@common-ui/common-ui.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    CommonUiModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
