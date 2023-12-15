import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { ChangeDetectionStrategy } from "@angular/core";

import { UserRoles } from "@common/constants/user.roles.enum";
import { User } from "@common/models/user";

import { LoadingService } from "@common/services/loading.service";
import { UserService } from "../../services/user.service";
import { NotificationService } from "@common/services/notification.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
})
export class EditComponent implements OnInit {
  form!: FormGroup;
  id = "";

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params["id"];
      if (this.id) {
        this.autocompleteForm();
      }
    });
  }

  autocompleteForm() {
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
      .subscribe(() => {
        this.notificationService.presentToast({
          message: "Usuario editado con exito",
          duration: 2500,
          color: "ion-color-success",
          position: "middle",
          icon: "alert-circle-outline",
        });
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
}
