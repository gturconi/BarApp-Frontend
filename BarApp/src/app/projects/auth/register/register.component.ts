import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { UserRoles } from "@common/constants/user.roles.enum";
import { Router } from "@angular/router";
import { LoadingService } from "@common/services/loading.service";
import { finalize } from "rxjs/operators";
import { User } from "@common/models/user";
import { UserService } from "../../services/user.service";
import { NotificationService } from "@common/services/notification.service";
import { UserRole } from "@common/models/userRole";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  form = new FormGroup({});

  validUserRoles = [UserRoles.Admin, UserRoles.Employee, UserRoles.Client];
  helper = new JwtHelperService();

  constructor(
    private userService: UserService,
    private router: Router,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {}

  //TO DO: TERMINAR EL REGISTRO
  async submit(form: FormGroup) {
    const nuevoUsuario: User = {
      _id: "",
      name: form.value.name!,
      email: form.value.email!,
      tel: form.value.tel!,
      password: form.value.password!,
      roleName: new UserRole("", form.value.roleName!),
    };
    const loading = await this.loadingService.loading();
    await loading.present();

    this.userService
      .postUsers(nuevoUsuario)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(() => {
        this.notificationService.presentToast({
          message: "Usuario creado con exito, por favor inicie sesion",
          duration: 2500,
          color: "ion-color-success",
          position: "middle",
          icon: "alert-circle-outline",
        });

        this.router.navigate(["/auth"]);
      });
  }

  formFields = [
    {
      type: "input",
      name: "name",
      label: "Nombre",
      autocomplete: "name",
      inputType: "text",
      icon: "person",
    },
    {
      type: "input",
      name: "tel",
      label: "Telefono",
      autocomplete: "tel",
      inputType: "text",
      icon: "call-outline",
    },
    {
      type: "input",
      name: "email",
      label: "Email",
      autocomplete: "email",
      inputType: "email",
      icon: "mail-outline",
    },
    {
      type: "input",
      name: "password",
      label: "Contraseña",
      inputType: "password",
      icon: "lock-closed-outline",
    },
  ];

  myButtons = [
    {
      label: "Registrarse",
      type: "button",
      routerLink: "register",
      icon: "person-add-outline",
    },
  ];

  validationConfig = [
    { controlName: "name", required: true, minLength: 4 },
    { controlName: "tel", required: true, minLength: 6 },
    { controlName: "email", required: true, email: true },
    { controlName: "password", required: true },
  ];
}
