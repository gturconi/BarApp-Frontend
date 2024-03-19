import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';

import { UserRoles } from '@common/constants/user.roles.enum';
import { User } from '@common/models/user';

import { LoadingService } from '@common/services/loading.service';
import { UserService } from '../../users/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form = new FormGroup({});

  validUserRoles = [UserRoles.Admin, UserRoles.Employee, UserRoles.Client];
  helper = new JwtHelperService();

  constructor(
    private userService: UserService,
    private router: Router,
    private loadingService: LoadingService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {}

  async submit(form: FormGroup) {
    const nuevoUsuario: User = {
      id: '',
      name: form.value.name!,
      email: form.value.email!,
      tel: form.value.tel!,
      password: CryptoJS.SHA256(form.value.password).toString(),
      role:
        form.value['rol'] === undefined
          ? UserRoles.Client
          : (form.value['rol'] as UserRoles),
    };
    const loading = await this.loadingService.loading();
    await loading.present();
    this.userService
      .postUsers(nuevoUsuario)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(() => {
        this.toastrService.success(
          'Usuario creado con exito, por favor inicie sesion'
        );
        this.router.navigate(['/auth']);
      });
  }

  formFields = [
    {
      type: 'input',
      name: 'name',
      label: 'Nombre',
      autocomplete: 'name',
      inputType: 'text',
      icon: 'material-symbols-outlined',
      iconName: 'person',
    },
    {
      type: 'input',
      name: 'tel',
      label: 'Telefono',
      autocomplete: 'tel',
      inputType: 'text',
      icon: 'material-symbols-outlined',
      iconName: 'phone',
    },
    {
      type: 'input',
      name: 'email',
      label: 'Email',
      autocomplete: 'email',
      inputType: 'email',
      icon: 'material-symbols-outlined',
      iconName: 'mail',
    },
    {
      type: 'input',
      name: 'password',
      label: 'Contraseña',
      inputType: 'password',
      icon: 'material-symbols-outlined',
      iconName: 'lock',
    },
    {
      type: 'captcha',
      name: 'recaptcha',
      label: 'Captcha',
      inputType: 'captcha',
    },
  ];

  myButtons = [
    {
      label: 'Registrarse',
      type: 'submit',
      routerLink: '',
      icon: 'person-add-outline',
    },
  ];

  validationConfig = [
    {
      controlName: 'name',
      required: true,
      minLength: 4,
      pattern: '^[a-zA-Z]*$',
    },
    {
      controlName: 'tel',
      required: true,
      minLength: 10,
      maxLength: 15,
      pattern: '^[0-9]*$',
    },
    { controlName: 'email', required: true, email: true },
    { controlName: 'password', required: true },
    { controlName: 'recaptcha', required: true },
  ];
}
