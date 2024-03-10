import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { InputComponent } from './input/input.component';
import { FormComponent } from './form/form.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { ComboComponent } from './combo/combo.component';
import { PaginationComponent } from './pagination/pagination.component';
import { TableComponent } from './table/table.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { AppSearchComponent } from './search/search.component';

import { CommonUiRoutingModule } from './common-ui-routing.module';

@NgModule({
  declarations: [
    InputComponent,
    FormComponent,
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    PaginationComponent,
    ComboComponent,
    TableComponent,
    DropdownComponent,
    AppSearchComponent,
  ],
  imports: [
    CommonModule,
    CommonUiRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    InputComponent,
    ReactiveFormsModule,
    FormComponent,
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    PaginationComponent,
    ComboComponent,
    TableComponent,
    DropdownComponent,
    AppSearchComponent,
  ],
})
export class CommonUiModule {}
