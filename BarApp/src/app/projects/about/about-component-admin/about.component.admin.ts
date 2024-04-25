import { Component, OnInit } from "@angular/core";
import { Contact } from "@common/models/about";
import { AboutService } from "../services/about.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { LoadingService } from '@common/services/loading.service';


@Component({
  templateUrl: "./about.component.admin.html",
  styleUrls: ["./about.component.admin.scss"],
  providers: [AboutService],
})

export class AboutComponentAdmin implements OnInit {
  id= '';
  data: Contact[] = [];
  isLoading:any = false;
  form: FormGroup = new FormGroup({});
  editMode: boolean = false;
  formTitle: string = 'Añadir Contacto';
  formFields!: any[];
  myButtons = [
    {
      label: 'Añadir',
      type: 'submit',
    },
  ];
  validationConfig!: any[];
  currentId!: string;
  
  constructor(private aboutService: AboutService, private toastrService: ToastrService, private router:Router, private loadingService: LoadingService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.formFields = [
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
        name: 'description',
        label: 'Descripcion',
        autocomplete: 'description',
        inputType: 'textarea',
        icon: 'material-symbols-outlined',
        iconName: 'info',
      },
      {
        type: 'input',
        name: 'address',
        label: 'Ubicacion',
        autocomplete: 'address',
        inputType: 'text',
        icon: 'material-symbols-outlined',
        iconName: 'location_on',
      },
      {
        type: 'input',
        name: 'open_dayhr',
        label: 'Dias y horarios de atencion',
        autocomplete: 'open_dayhr',
        inputType: 'textarea',
        icon: 'material-symbols-outlined',
        iconName: 'schedule',
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
        name: 'contact_email',
        label: 'Email',
        autocomplete: 'email',
        inputType: 'email',
        icon: 'material-symbols-outlined',
        iconName: 'mail',
      },
    ];
  
    this.validationConfig = [
      { controlName: 'name', required: true },
      { controlName: 'description', required: true },
      { controlName: 'address', required: true },
      { controlName: 'open_dayhr', required: true },
      {
        controlName: 'tel',
        required: true,
        minLength: 10,
        maxLength: 15,
        pattern: '^[0-9]*$',
      },
      { controlName: 'contact_email', email: true, required: true },
    ];
  }

  ngAfterViewInit() {
    this.autocompleteForm();
  }

  autocompleteForm(){
    const formData = this.getInitialFormData();
    
    if (formData) {
      this.currentId = formData.id;
      this.form.get('name')?.setValue(formData.name);
      this.form.get('description')?.setValue(formData.description);
      this.form.get('address')?.setValue(formData.address);
      this.form.get('open_dayhr')?.setValue(formData.open_dayhr);
      this.form.get('tel')?.setValue(formData.tel);
      this.form.get('contact_email')?.setValue(formData.contact_email);
      this.editMode = true;
      this.formTitle = 'Editar Contacto';
      this.myButtons = [
        {
          label: 'Editar',
          type: 'submit',
        },
      ];
    }
  }

  

  getInitialFormData() {
    const data = window.localStorage.getItem("temporary_contact");
    if (!!data) {
      const contact = JSON.parse(data) as Contact;
      return contact;
    }
    return null;
  }

  setContactForm(form: FormGroup): void {
    this.form = form;
  }

  async onSubmit(form: FormGroup): Promise<void> {
    this.form = form;
    this.isLoading = await this.loadingService.loading();
    await this.isLoading.present();
    if (form.valid) {
      if(!this.currentId){
        this.addContact(form);
        this.isLoading.dismiss();
         this.router.navigate(['/about']);
         this.toastrService.success('Contacto agregado exitosamente');
         window.localStorage.removeItem("temporary_contact");
      }else{
        this.editContact(form).subscribe(() => {
         this.isLoading.dismiss();
         this.router.navigate(['/about']);
         this.toastrService.success('Informacion del contacto editada');
        })
        window.localStorage.removeItem("temporary_contact");
      }
    }
  }
 
  addContact(form: FormGroup): void {
    const nuevoContact: Contact = {
      id: '',
      name: form.value.name,
      description:  form.value.description,
      address:  form.value.address,
      open_dayhr: form.value.open_dayhr,
      tel: form.value.tel,
      contact_email: form.value.contact_email,
    };

    this.aboutService.postContact(nuevoContact).subscribe(() => {
      this.toastrService.success('Usuario anadido');
      this.router.navigate(['/about']);
    });
  }
  editContact(form: FormGroup): Observable<Contact> {
    const nuevoContact: Contact = {
      id: this.currentId,
      name: form.value.name,
      description:  form.value.description,
      address:  form.value.address,
      open_dayhr: form.value.open_dayhr,
      tel: form.value.tel,
      contact_email: form.value.contact_email,
    };
    return this.aboutService.putContact(nuevoContact);
  }
}

