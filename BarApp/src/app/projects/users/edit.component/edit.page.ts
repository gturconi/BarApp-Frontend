import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@common/services/notification.service';
import { UserService } from 'src/app/projects/services/user.service';
import { User } from '@common/models/user';
import * as CryptoJS from 'crypto-js';
import { RoleService } from '../../services/role.service';
import { UserRole } from '@common/models/userRole';
import { DropdownParam } from '@common/models/dropdown';
import { EntityListResponse } from '@common/models/entity.list.response';
import { Subject } from 'rxjs';
import { LoadingService } from '@common/services/loading.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-user',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  providers: [UserService, Router],
})
export class UserEditPage {
  id = '';
  form!: FormGroup;

  editMode = false;
  formTitle = '';

  formFields!: any[];
  myButtons!: any[];
  validationConfig!: any[];
  roleList: UserRole[] = [];

  comboParam: DropdownParam[] = [
    {
      title: 'Rol',
      fields: new Subject<EntityListResponse<any>>(),
      defaultValue: new Subject<string>(),
    },
  ];

  constructor(
    private userService: UserService,
    public router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private roleService: RoleService,
    private loadingSerrvice: LoadingService
  ) {}

  ngOnInit() {
    this.formFields = [
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
    ];

    this.validationConfig = [
      { controlName: 'email', email: true, required: true },
      { controlName: 'name', required: true },
      { controlName: 'tel', required: true },
      { controlName: 'Rol' },
    ];

    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.loadCombo();
      if (this.id) {
        this.myButtons = [
          {
            label: 'Editar',
            type: 'submit',
          },
        ];
        this.editMode = true;
        this.formTitle = 'Editar Usuario';
        this.autocompleteForm();
      } else {
        this.formTitle = 'Añadir Usuario';
        this.myButtons = [
          {
            label: 'Añadir',
            type: 'submit',
          },
        ];
      }
    });
  }

  autocompleteForm() {
    this.userService.getUser(this.id).subscribe(user => {
      this.form.get('name')?.setValue(user.name as never);
      this.form.get('email')?.setValue(user.email as never);
      this.form.get('tel')?.setValue(user.tel as never);
      this.comboParam[0].defaultValue!.next(user.roleId);
      // this.form.get('role')?.setValue(user.roleId as never);
    });
  }

  async loadCombo() {
    const loading = await this.loadingSerrvice.loading();
    await loading.present();
    this.roleService.getRoles().subscribe(roleResponse => {
      roleResponse.results = roleResponse.results.map(role => {
        return {
          ...role,
          name: UserRole.roleTranslations[role.name],
        } as UserRole;
      });

      this.comboParam[0].fields!.next(roleResponse);
      if (this.id) this.autocompleteForm();
      else {
        const role = roleResponse.results as UserRole[];
        this.comboParam[0].defaultValue!.next(role[0]?.name!);
        this.form.controls['Rol']?.setValue(role[0]?.id);
      }
      loading.dismiss();
    });
  }

  postUser(form: FormGroup): void {
    console.log({ form });
    const nuevoUsuario: User = {
      id: '',
      name: form.value.name,
      email: form.value.email,
      password: CryptoJS.SHA256(form.value.password).toString(),
      role: this.roleList.find(role => role.id === form.value.role)?.name,
      tel: form.value.tel,
    };

    this.userService.postUsers(nuevoUsuario).subscribe(() => {
      this.notificationService.presentToast({
        header: 'success',
        message: 'Se dio de alta el usuario',
      });
      this.router.navigate(['/users']);
    });
  }

  putUser(form: FormGroup): void {
    const nuevoUsuario: User = {
      id: this.id,
      name: form.value.name,
      email: form.value.email,
      tel: form.value.tel,
      roleId: form.value.role,
    };

    this.userService.putUsers(nuevoUsuario).subscribe(() => {
      this.router.navigate(['/users']);
      this.notificationService.presentToast({
        header: 'success',
        message: 'Se actualizo el usuario',
      });
    });
  }

  setUserForm(form: FormGroup): void {
    this.form = form;
  }

  onSubmit(form: FormGroup): void {
    this.form = form;
    if (form.valid) {
      if (!this.id) {
        this.postUser(form);
      } else {
        this.putUser(form);
      }
    }
  }
}
