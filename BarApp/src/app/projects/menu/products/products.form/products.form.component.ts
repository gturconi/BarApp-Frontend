import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '@common/services/loading.service';
import { ProductsTypeService } from '../../products-type/services/products-type.service';
import { ProductsService } from '../services/products.service';

import { EntityListResponse } from '@common/models/entity.list.response';
import { ProductsType } from '../../products-type/models/productsType';
import { DropdownParam } from '@common/models/dropdown';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-products.form',
  templateUrl: './products.form.component.html',
  styleUrls: ['./products.form.component.scss'],
})
export class ProductsFormComponent implements OnInit {
  id = '';
  formTitle = 'Añadir Producto';
  editMode = false;
  form!: FormGroup;
  validationConfig: { controlName: string; required: boolean }[] = [];

  productTypeList = new Subject<EntityListResponse<ProductsType>>();

  comboParam: DropdownParam[] = [
    {
      title: 'Tipo de producto',
      fields: new Subject<EntityListResponse<any>>(),
      defaultValue: new Subject<string>(),
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private productsTypeService: ProductsTypeService,
    private toastrService: ToastrService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.loadCombos();
      if (this.id) {
        this.editMode = true;
        this.formTitle = 'Editar Producto';
      }
      this.setupValidationConfig();
    });
  }

  async autocompleteForm() {
    this.productsService.getProduct(this.id).subscribe(data => {
      this.form.get('name')?.setValue(data.name);
      this.form.get('description')?.setValue(data.description);
      this.form.get('price')?.setValue(data.price);
      this.comboParam[0].defaultValue!.next(data.category!);
    });
  }

  loadCombos() {
    this.productsTypeService.getProductsTypes().subscribe(response => {
      this.comboParam[0].fields!.next(response);
      if (this.id) this.autocompleteForm();
    });
  }

  setForm(form: FormGroup): void {
    this.form = form;
  }

  async add(form: FormGroup) {
    const fileControl = form.controls['image'];
    const imageFile: File = fileControl.value;

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('name', form.controls['name'].value);
    formData.append('description', form.controls['description'].value);

    //agregar mas
    const loading = await this.loadingService.loading();
    await loading.present();
    this.productsService
      .postProducts(formData)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(() => {
        this.toastrService.success('Producto añadido');
        loading.dismiss();
        //TODO cambiar el routeo
        this.router.navigate(['/menu/categories']);
      });
  }

  async edit(form: FormGroup) {
    console.log(form.controls['Tipo de producto'].value);
    /*
    let imageFile = null;
    const formData = new FormData();

    const fileControl = form.controls['image'];
    if (fileControl.value) {
      imageFile = fileControl.value;
      formData.append('image', imageFile);
    }
    formData.append('name', form.controls['name'].value);
    formData.append('description', form.controls['description'].value);
    formData.append('price', form.controls['price'].value);
    //agregar mas

    const loading = await this.loadingService.loading();
    await loading.present();
    this.productsService
      .putProducts(this.id, formData)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(() => {
        this.toastrService.success('Producto editado');
        loading.dismiss();
        //TODO cambiar el routeo
        this.router.navigate(['/menu/categories']);
      });*/
  }

  //agregar mas
  formFields = [
    {
      type: 'input',
      name: 'name',
      label: 'Nombre',
      inputType: 'text',
      icon: 'material-symbols-outlined',
      iconName: 'restaurant',
    },
    {
      type: 'input',
      name: 'description',
      label: 'Descripción',
      inputType: 'text',
      icon: 'material-symbols-outlined',
      iconName: 'restaurant',
    },
    {
      type: 'input',
      name: 'price',
      label: 'Precio',
      inputType: 'number',
      icon: 'material-symbols-outlined',
      iconName: 'paid',
    },
    {
      type: 'input',
      name: 'image',
      label: 'Imagen',
      inputType: 'file',
    },
  ];

  myButtons = [
    {
      label: this.editMode ? 'Editar' : 'Añadir',
      type: 'submit',
      routerLink: '',
      icon: 'add-circle-outline',
    },
  ];

  setupValidationConfig() {
    this.validationConfig = [
      { controlName: 'name', required: true },
      { controlName: 'description', required: true },
      { controlName: 'price', required: true },
      { controlName: 'image', required: !this.editMode },
      { controlName: 'Tipo de Producto', required: true },
    ];
  }
}
