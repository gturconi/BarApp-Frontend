import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CommonUiRoutingModule } from "./common-ui-routing.module";
import { InputComponent } from "./input/input.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormComponent } from "./form/form.component";
import { TableComponent } from "./table/table.component";
import { DropdownComponent } from "./dropdown/dropdown.component";

@NgModule({
  declarations: [InputComponent, FormComponent, TableComponent, DropdownComponent],
  imports: [
    CommonModule,
    CommonUiRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [InputComponent, ReactiveFormsModule, FormComponent, TableComponent, DropdownComponent],
})
export class CommonUiModule {}
