import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthRoutingModule } from "./auth-routing.module";
import { CommonUiModule } from "@common-ui/common-ui.module";
import { IonicModule } from "@ionic/angular";
import { AuthComponent } from "./auth.component/auth.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    IonicModule,
    CommonUiModule,
    ReactiveFormsModule,
  ],
})
export class AuthModule {}
