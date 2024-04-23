import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxCaptchaModule } from 'ngx-captcha';

import { InputComponent } from './input/input.component';
import { FormComponent } from './form/form.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ComboComponent } from './combo/combo.component';

import { CommonUiRoutingModule } from './common-ui-routing.module';
import { SearchComponent } from './search/search.component';
import { TableComponent } from './table/table.component';
import { ModalComponent } from './modal/modalComponent';

@NgModule({
  declarations: [
    InputComponent,
    FormComponent,
    HeaderComponent,
    MenuComponent,
    FooterComponent,
    PaginationComponent,
    ComboComponent,
    SearchComponent,
    TableComponent,
    ModalComponent,
  ],
  imports: [
    CommonModule,
    CommonUiRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
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
    SearchComponent,
    TableComponent,
    ModalComponent,
  ],
})
export class CommonUiModule {}
