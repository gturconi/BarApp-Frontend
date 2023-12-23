import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from "@common/services/notification.service";
import { UserService } from "src/app/projects/services/user.service";
import { User } from "@common/models/user";
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  providers: [UserService, Router],
})
export class UserEditPage {
  id = '';
  form = new FormGroup({});
  editMode = false;
  formTitle = '';

  formFields!: any[];
  myButtons!: any[];
  validationConfig!: any[];

  constructor(private userService: UserService, public router : Router, private route: ActivatedRoute, private notificationService:NotificationService) { }

  ngOnInit() {
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
        type: "select",
        name: "role",
        label: "Rol",
        autocomplete: "role",
        placeholder: "Selecciona un rol",
        icon: "material-symbols-outlined",
        iconName: "phone",
        options: [{value: "admin", label:"Admin"},{value: "mozo", label:"Mozo"}]
      },
    ]

    this.validationConfig = [
      { controlName: "email", email: true },
      { controlName: "name" },
      { controlName: "tel" },
    ];

    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log(this.id);
      if(this.id){
        this.myButtons = [
          {
            label: "Editar",
            type: "submit",
          },
        ];
        this.editMode = true;
        this.formTitle = 'Editar Usuario';
        this.autocompleteForm();
      } else {
        this.formTitle = 'Añadir Usuario';
        this.myButtons = [
          {
            label: "Añadir",
            type: "submit",
          },
        ];
      }     
    });
  }

  autocompleteForm(){
    this.userService.getUser(this.id).subscribe(user => {
      console.log(user, this.form)
      this.form.get('name')?.setValue(user.name as never);
      this.form.get('email')?.setValue(user.email as never);
      this.form.get('tel')?.setValue(user.tel as never);
    });
  } 

  postUser(form: FormGroup): void {
    const nuevoUsuario: User = { 
      id: '', 
      name: form.value.nombre, 
      email: form.value.email, 
      password: CryptoJS.SHA256(form.value.password).toString(),
      role: form.value['rol']
    };

    this.userService.postUsers(nuevoUsuario)
      .subscribe(() => {
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
      name: form.value.nombre,
      email: form.value.email,
      tel: form.value.tel,
      role: form.value['rol'],
    };
  
    this.userService.putUsers(nuevoUsuario)
      .subscribe(() => {
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
      if(!this.id){
        this.postUser(form);
      }else{
          this.putUser(form);
      }
      
    }
  }
}


