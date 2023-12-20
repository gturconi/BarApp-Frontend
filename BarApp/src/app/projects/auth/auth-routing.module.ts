import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { AuthComponent } from "./auth.component/auth.component";
import { ForgotComponent } from "./forgot/forgot.component";
import { ProfileComponent } from "./profile/profile.component";
import { EditComponent } from "./edit/edit.component";

import { authGuard } from "@common/guards";

const routes: Routes = [
  {
    path: "",
    component: AuthComponent,
    children: [
      { path: "", component: LoginComponent },
      {
        path: "register",
        component: RegisterComponent,
      },
      {
        path: "forgot-password",
        component: ForgotComponent,
      },
      {
        path: "new-password/:token",
        component: ForgotComponent,
      },
      {
        path: "profile",
        component: ProfileComponent,
        canActivate: [authGuard],
      },
      {
        path: "profile/edit/:id",
        component: EditComponent,
        canActivate: [authGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
