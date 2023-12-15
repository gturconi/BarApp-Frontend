import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { AuthComponent } from "./auth.component/auth.component";
import { ForgotComponent } from "./forgot/forgot.component";
import { ProfileComponent } from "./profile/profile.component";

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
      },
      {
        path: "profile/edit/:id",
        component: RegisterComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
