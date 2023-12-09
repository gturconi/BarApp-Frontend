import { Component, OnInit, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "@common/services/login.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { UserRoles } from "@common/constants/user.roles.enum";
import { Router } from "@angular/router";
import { LoadingService } from "@common/services/loading.service";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]),
  });

  validUserRoles = [UserRoles.Admin, UserRoles.Employee, UserRoles.Client];
  helper = new JwtHelperService();

  constructor(
    private loginService: LoginService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {}

  async submit() {
    const loading = await this.loadingService.loading();
    await loading.present();

    this.loginService
      .authenticateUser(this.form.value.email!, this.form.value.password!)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe((res: any) => {
        const decodedToken = this.helper.decodeToken(res.token);
        this.loginService.setToken(res.token);
        this.loginService.getUser(decodedToken.id).subscribe((user: any) => {
          this.loginService.setUser(user);
          loading.dismiss();
          this.validateRol();
        });
      });
  }

  private validateRol(): void {
    let role: UserRoles = this.loginService.getUserRole();
    if (this.validUserRoles.includes(role)) {
      console.log(`Role ${role} is valid`);
      //this.router.navigate(["dashboard"]);
    } else {
      this.loginService.logout();
    }
  }
}
