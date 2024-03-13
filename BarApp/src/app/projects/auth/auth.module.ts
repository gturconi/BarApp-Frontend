import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { CommonUiModule } from '@common-ui/common-ui.module';
import { IonicModule } from '@ionic/angular';
import { AuthComponent } from './auth.component/auth.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { LoginService } from '@common/services/login.service';
import { ProfileComponent } from './profile/profile.component';
import { EditComponent } from './edit/edit.component';
import { UsersModule } from '../users/users.module';

@NgModule({
  declarations: [
    AuthComponent,
    RegisterComponent,
    LoginComponent,
    ForgotComponent,
    ProfileComponent,
    EditComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    IonicModule,
    CommonUiModule,
    ReactiveFormsModule,
    UsersModule,
  ],
  providers: [LoginService],
})
export class AuthModule {}
