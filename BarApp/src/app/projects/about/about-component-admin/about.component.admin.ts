import { Component, OnInit } from "@angular/core";
import { Contact } from "@common/models/about";
import { AboutService } from "../services/about.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";

@Component({
  templateUrl: "./about.component.admin.html",
  styleUrls: ["./about.component.admin.scss"],
  providers: [AboutService],
})

export class AboutComponentAdmin implements OnInit {
  data: Contact[] = [];
  isLoading: boolean = false;
  form: FormGroup = new FormGroup({});
  editMode: boolean = true;
  formTitle: string = 'Editar Contacto';
  formFields!: any[];
  myButtons!: any[];
  validationConfig!: any[];
  currentId!: string;
  
  constructor(private aboutService: AboutService, private toastrService: ToastrService, private router:Router) {
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
        inputType: 'text',
        icon: 'material-symbols-outlined',
        iconName: 'person',
      },
      {
        type: 'input',
        name: 'address',
        label: 'Ubicacion',
        autocomplete: 'address',
        inputType: 'text',
        icon: 'material-symbols-outlined',
        iconName: 'person',
      },
      {
        type: 'input',
        name: 'open_dayhr',
        label: 'Dias y horarios de atencion',
        autocomplete: 'open_dayhr',
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
      { controlName: 'tel', required: true },
      { controlName: 'contact_email', email: true, required: true },
    ];
    
    this.myButtons = [
      {
        label: 'Editar',
        type: 'submit',
      },
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

  onSubmit(form: FormGroup): void {
    this.form = form;
    if (form.valid) {
       this.editContact(form).subscribe(() => {
        this.router.navigate(['/about']);
        this.toastrService.success('Informacion del contacto editada');
       })
       window.localStorage.removeItem("temporary_contact");
    }
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

