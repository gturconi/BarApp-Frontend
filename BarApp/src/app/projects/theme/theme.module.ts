import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ThemesComponent } from './themes/themes.component';
import { ThemesListComponent } from './themes.list/themes.list.component';
import { ThemeRoutingModule } from './theme-routing.module';
import { ThemesDetailsComponent } from './themes.details/themes.details.component';

@NgModule({
  declarations: [ThemesComponent, ThemesListComponent, ThemesDetailsComponent],
  imports: [CommonModule, ThemeRoutingModule, IonicModule],
  exports: [ThemesComponent, ThemesListComponent, ThemesDetailsComponent],
})
export class ThemeModule {}
