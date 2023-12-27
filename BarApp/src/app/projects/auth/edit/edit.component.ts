import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { ChangeDetectionStrategy } from "@angular/core";

import { User } from "@common/models/user";

import { LoadingService } from "@common/services/loading.service";
import { UserService } from "../../services/user.service";
import { LoginService } from "@common/services/login.service";
import { ToastrService } from "ngx-toastr";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
})
export class EditComponent implements OnInit {
  form!: FormGroup;
  form2!: FormGroup;
  id = "";

  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private toastrService: ToastrService
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params["id"];
      if (this.id) {
        this.autocompleteForm();
      }
    });
  }

  async autocompleteForm() {
    this.userService.getUser(this.id).subscribe(user => {
      this.form.get("name")?.setValue(user.name);
      this.form.get("email")?.setValue(user.email);
      this.form.get("tel")?.setValue(user.tel);
    });
  }

  setUserForm(form: FormGroup): void {
    this.form = form;
  }

  async submit(form: FormGroup) {
    const usuaroActualizado: User = {
      id: this.id,
      name: form.value.name!,
      email: form.value.email!,
      tel: form.value.tel!,
    };

    const loading = await this.loadingService.loading();
    await loading.present();
    this.userService
      .putUsers(usuaroActualizado)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(user => {
        this.toastrService.success("Usuario editado con exito");
        this.loginService.setUser(user);
        loading.dismiss();
        this.router.navigate(["/auth/profile"]);
      });
  }

  async changePassword(form: FormGroup) {
    const usuaroActualizado: User = {
      id: this.id,
      password: form.value.passwordActual!,
      newPassword: form.value.password!,
    };

    const loading = await this.loadingService.loading();
    await loading.present();
    this.userService
      .changePassword(usuaroActualizado)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(() => {
        this.toastrService.success("Contraseña cambiada con exito");
        loading.dismiss();
        this.router.navigate(["/auth/profile"]);
      });
  }

  formFields = [
    {
      type: "input",
      name: "name",
      label: "Nombre",
      autocomplete: "name",
      inputType: "text",
      icon: "material-symbols-outlined",
      iconName: "person",
    },
    {
      type: "input",
      name: "tel",
      label: "Telefono",
      autocomplete: "tel",
      inputType: "text",
      icon: "material-symbols-outlined",
      iconName: "phone",
    },
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

  myButtons = [
    {
      label: "Editar",
      type: "submit",
      routerLink: "",
      icon: "person-add-outline",
    },
  ];

  validationConfig = [
    { controlName: "name", required: true, minLength: 4 },
    { controlName: "tel", required: true, minLength: 6 },
    { controlName: "email", required: true, email: true },
  ];

  formFields2 = [
    {
      type: "input",
      name: "passwordActual",
      label: "Contraseña actual",
      inputType: "password",
      icon: "material-symbols-outlined",
      iconName: "lock",
    },
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

  validationConfig2 = [
    { controlName: "passwordActual", required: true },
    { controlName: "password", required: true },
    {
      controlName: "password2",
      required: true,
      customValidation: (form: FormGroup) => {
        const passwordControl = form.get("password");
        const password2Control = form.get("password2");

        if (passwordControl && password2Control) {
          const passwordValue = passwordControl.value;
          const password2Value = password2Control.value;

          if (passwordValue !== password2Value) {
            password2Control.setErrors({ notSame: true });
          } else {
            password2Control.setErrors(null);
          }
        }
        return null;
      },
    },
  ];
}
