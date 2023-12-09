import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CommonUiRoutingModule } from "./common-ui-routing.module";
import { InputComponent } from "./input/input.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormComponent } from "./form/form.component";

@NgModule({
  declarations: [InputComponent, FormComponent],
  imports: [
    CommonModule,
    CommonUiRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [InputComponent, ReactiveFormsModule, FormComponent],
})
export class CommonUiModule {}
