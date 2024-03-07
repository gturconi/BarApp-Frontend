import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '@common/services/loading.service';
import { ProductsTypeService } from '../../products-type/services/products-type.service';
import { ProductsService } from '../../products/services/products.service';
import { PromotionsService } from '../services/promotions.service';

import { EntityListResponse } from '@common/models/entity.list.response';
import { ProductsType } from '../../products-type/models/productsType';
import { DropdownParam } from '@common/models/dropdown';
import { ValidationConfig } from '@common/models/validationConfig';
import { Button, FormField } from '@common/models/formTypes';

@Component({
  selector: 'app-promotions-form',
  templateUrl: './promotions-form.component.html',
  styleUrls: ['./promotions-form.component.scss'],
})
export class PromotionsFormComponent implements OnInit {
  id = '';
  idCat = '';
  formTitle = 'Añadir Promoción';
  editMode = false;

  form!: FormGroup;
  validationConfig: ValidationConfig[] = [];
  formFields: FormField[] = [];
  myButtons: Button[] = [];

  productTypeList = new Subject<EntityListResponse<ProductsType>>();

  comboParam: DropdownParam[] = [
    {
      title: 'Categoria',
      fields: new Subject<EntityListResponse<any>>(),
      defaultValue: new Subject<string>(),
      isMultiple: true,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private promotionService: PromotionsService,
    private productsTypeService: ProductsTypeService,
    private toastrService: ToastrService,
    private loadingService: LoadingService,
    private location: Location
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.loadCombos();
      if (this.id) {
        this.editMode = true;
        this.formTitle = 'Editar Promoción';
      }
      this.route.parent!.params.subscribe(parentParams => {
        this.idCat = parentParams['idCat'];
      });
      this.setFormInputs();
      this.setupValidationConfig();
    });
  }

  async autocompleteForm() {
    this.productsService.getProduct(this.id).subscribe(data => {
      this.form.get('description')?.setValue(data.description);
      this.form.get('price')?.setValue(data.price);
      this.form.get('baja')?.setValue(data.baja);
      this.comboParam[0].defaultValue!.next(data.category!);
      this.form.controls['Categoria']?.setValue(this.idCat);
    });
  }

  async loadCombos() {
    const loading = await this.loadingService.loading();
    await loading.present();
    this.productsTypeService.getProductsTypes().subscribe(response => {
      this.comboParam[0].fields!.next(response);
      if (this.id) this.autocompleteForm();
      else {
        const cat = response.results.find(
          (type: ProductsType) => type.id == this.idCat
        );
        this.comboParam[0].defaultValue!.next(cat?.description!);
        this.form.controls['Categoria']?.setValue(this.idCat);
      }
      loading.dismiss();
    });
  }

  setForm(form: FormGroup): void {
    this.form = form;
  }

  async add(form: FormGroup) {
    const fileControl = form.controls['image'];
    const imageFile: File = fileControl.value;
    const baja = form.controls['baja'].value ? 0 : 1;
    const category = form.controls['Categoria'].value;
    //ver si esta ok el descuento respecto al backend
    const discountValue = form.controls['discount'].value / 100;

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('description', form.controls['description'].value);
    formData.append('price', form.controls['price'].value);
    formData.append('discount', discountValue.toString());
    formData.append('valid_from', form.controls['valid_from'].value);
    formData.append('valid_to', form.controls['valid_to'].value);
    formData.append('baja', baja.toString());
    formData.append('idCat', category);

    const loading = await this.loadingService.loading();
    await loading.present();
    this.promotionService
      .postPromotions(formData)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(() => {
        this.toastrService.success('Producto añadido');
        loading.dismiss();
        this.location.back();
      });
  }

  async edit(form: FormGroup) {}

  setFormInputs() {
    this.formFields = [
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
        name: 'discount',
        label: 'Porcentaje Descuento',
        inputType: 'number',
        icon: 'material-symbols-outlined',
        iconName: 'percent',
      },
      {
        type: 'input',
        name: 'image',
        label: 'Imagen',
        inputType: 'file',
      },
      {
        type: 'checkbox',
        name: 'baja',
        label: 'Ocultar promoción',
        inputType: 'checkbox',
        icon: 'material-symbols-outlined',
        iconName: 'inventory',
      },
      {
        type: 'input',
        name: 'valid_from',
        label: 'Fecha Desde',
        inputType: 'date',
      },
      {
        type: 'input',
        name: 'valid_to',
        label: 'Fecha Hasta',
        inputType: 'date',
      },
    ];

    this.myButtons = [
      {
        label: this.editMode ? 'Editar' : 'Añadir',
        type: 'submit',
        routerLink: '',
        icon: 'add-circle-outline',
      },
    ];
  }

  setupValidationConfig() {
    this.validationConfig = [
      { controlName: 'description', required: true },
      { controlName: 'price', required: false, min: 0 },
      { controlName: 'discount', required: false, min: 0, max: 100 },
      { controlName: 'image', required: !this.editMode },
      { controlName: 'baja' },
      { controlName: 'Categoria' },
      {
        controlName: 'valid_from',
        required: false,
        customValidation: (form: FormGroup) => {
          const validFrom = form.get('valid_from');
          const validTo = form.get('valid_to');

          if (validFrom && validTo) {
            const fromDate = validFrom.value;
            const toDate = validTo.value;

            if ((fromDate && !toDate) || (!fromDate && toDate)) {
              validFrom.setErrors({ Datevalid: true });
              validTo.setErrors({ Datevalid: true });
            } else if (fromDate > toDate) {
              validFrom.setErrors({ DateInvalidRange: true });
              validTo.setErrors(null);
            } else {
              validFrom.setErrors(null);
              validTo.setErrors(null);
            }
          }

          return null;
        },
      },
      {
        controlName: 'valid_to',
        required: false,
        customValidation: (form: FormGroup) => {
          const validFrom = form.get('valid_from');
          const validTo = form.get('valid_to');

          if (validFrom && validTo) {
            const fromDate = validFrom.value;
            const toDate = validTo.value;

            if ((fromDate && !toDate) || (!fromDate && toDate)) {
              validFrom.setErrors({ Datevalid: true });
              validTo.setErrors(null);
            } else if (fromDate > toDate) {
              validFrom.setErrors({ DateInvalidRange: true });
              validTo.setErrors(null);
            } else {
              validFrom.setErrors(null);
              validTo.setErrors(null);
            }
          }

          return null;
        },
      },
    ];
  }
}
