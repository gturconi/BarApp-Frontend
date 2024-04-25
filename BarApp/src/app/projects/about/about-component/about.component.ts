import { Component, OnInit } from '@angular/core';
import { Contact } from '@common/models/about';
import { AboutService } from '../services/about.service';
import { Router } from '@angular/router';
import { LoadingService } from '@common/services/loading.service';
import { RoleService } from '../../users/services/role.service';
import { LoginService } from '@common/services/login.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ContactMessage } from '@common/models/contactMessage';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  providers: [AboutService],
})
export class AboutComponent implements OnInit {
  id = '';
  data: Contact[] = [];
  isLoading!: any;
  isAdmin: boolean = false;
  form: FormGroup = new FormGroup({});
  editMode: boolean = false;
  formTitle: string = 'Contactate con nosotros';
  formFields!: any[];
  myButtons = [
    {
      label: 'Enviar',
      type: 'submit',
    },
  ];
  validationConfig!: any[];

  constructor(
    private aboutService: AboutService,
    private loginService: LoginService,
    public router: Router,
    private toastrService: ToastrService,
    private loadingService: LoadingService
  ) {
    this.formFields = [
      {
        type: 'input',
        name: 'name',
        autocomplete: '',
        label: 'Nombre',
        inputType: 'text',
        icon: 'material-symbols-outlined',
        iconName: 'person',
      },
      {
        type: 'input',
        name: 'email',
        autocomplete: '',
        label: 'Email',
        inputType: 'email',
        icon: 'material-symbols-outlined',
        iconName: 'mail',
      },
      {
        type: 'textarea',
        name: 'description',
        autocomplete: '',
        label: 'Descripcion',
        inputType: 'text',
        icon: 'material-symbols-outlined',
        iconName: 'info',
      },
    ];

    this.validationConfig = [
      { controlName: 'name', required: true },
      { controlName: 'description', required: true },
      { controlName: 'email', email: true, required: true },
    ];
  }

  async ngOnInit() {
    this.isLoading = await this.loadingService.loading();
    await this.isLoading.present();
    this.aboutService.getContact().subscribe(response => {
      this.data = response.results;
      this.isLoading.dismiss();
    });
    this.isAdmin = this.loginService.isAdmin();
  }

  redirectToEditForm(data: Contact) {
    window.localStorage.setItem('temporary_contact', JSON.stringify(data));
    this.router.navigate(['about/edit/']);
  }

  redirectToAddForm() {
    this.router.navigate(['about/edit/']);
  }

  setAboutForm(form: FormGroup): void {
    this.form = form;
  }

  async onSubmit(form: FormGroup): Promise<void> {
    this.form = form;
    this.isLoading = await this.loadingService.loading();
    await this.isLoading.present();
    if (form.valid) {
      const { name, email, description } = this.form.value;
      const message = new ContactMessage(name, email, description);
      this.aboutService.postMessage(message).subscribe(() => {
        this.isLoading.dismiss();
        this.form.reset();
        this.toastrService.success('Mensaje enviado exitosamente');
      });
    }
  }
}
