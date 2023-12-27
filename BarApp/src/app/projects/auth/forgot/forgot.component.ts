import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { finalize } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

import { LoadingService } from "@common/services/loading.service";
import { LoginService } from "@common/services/login.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-forgot",
  templateUrl: "./forgot.component.html",
  styleUrls: ["./forgot.component.scss"],
})
export class ForgotComponent implements OnInit {
  form = new FormGroup({});
  formFields!: any[];
  myButtons!: any[];
  validationConfig!: any[];
  token?: string;

  constructor(
    private loginService: LoginService,
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  currentUrl = this.route.snapshot.url.join("/");

  ngOnInit() {
    const currentUrl = this.route.snapshot.url.join("/");

    if (currentUrl === "forgot-password") {
      this.showForm1();
    } else if (currentUrl.startsWith("new-password")) {
      this.route.params.subscribe(params => {
        this.token = params["token"];
        if (this.token) {
          this.showForm2();
        }
      });
    }
  }

  showForm1() {
    this.formFields = [
      {
        type: "input",
        name: "email",
        label: "Email",
        autocomplete: "email",
        inputType: "email",
        icon: "material-symbols-outlined",
        iconName: "mail",
      },
    ];

    this.myButtons = [
      {
        label: "Recuperar",
        type: "submit",
        icon: "log-in-outline",
      },
    ];

    this.validationConfig = [
      { controlName: "email", required: true, email: true },
    ];
  }

  showForm2() {
    this.formFields = [
      {
        type: "input",
        name: "password",
        label: "Nueva contraseña",
        inputType: "password",
        icon: "material-symbols-outlined",
        iconName: "lock",
      },
      {
        type: "input",
        name: "password2",
        label: "Repetir nueva contraseña",
        inputType: "password",
        icon: "material-symbols-outlined",
        iconName: "lock",
      },
    ];
    this.myButtons = [
      {
        label: "Recuperar",
        type: "submit",
        icon: "log-in-outline",
      },
    ];

    this.validationConfig = [
      { controlName: "password", required: true },
      { controlName: "password2", required: true },
    ];
  }

  async submit(form: FormGroup) {
    const loading = await this.loadingService.loading();
    await loading.present();

    this.loginService
      .recoveryPassword(form.value.email!)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe((res: any) => {
        this.toastrService.success(res.message);
      });
  }

  async submit2(form: FormGroup) {
    const loading = await this.loadingService.loading();
    await loading.present();

    if (form.value.password != form.value.password2) {
      loading.dismiss();
      this.toastrService.error("Las contraseñas no coinciden");
      return;
    }

    if (this.token != null) {
      this.loginService.setToken(this.token);
      this.loginService
        .resetPassword(form.value.password!)
        .pipe(finalize(() => loading.dismiss()))
        .subscribe((res: any) => {
          this.toastrService.success(res.message);
          loading.dismiss();
          this.router.navigate(["auth"]);
        });
    }
  }
}
