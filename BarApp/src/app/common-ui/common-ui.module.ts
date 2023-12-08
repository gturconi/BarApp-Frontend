import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CommonUiRoutingModule } from "./common-ui-routing.module";
import { InputComponent } from "./input/input.component";
import { MenuComponent } from "./menu/menu.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [InputComponent, MenuComponent],
  imports: [
    CommonModule,
    CommonUiRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [InputComponent,MenuComponent, ReactiveFormsModule],
})
export class CommonUiModule {}
