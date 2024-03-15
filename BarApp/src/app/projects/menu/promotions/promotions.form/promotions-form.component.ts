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
import { Products } from '../../products/models/products';
import { DropdownParam } from '@common/models/dropdown';
import { ValidationConfig } from '@common/models/validationConfig';
import { Button, FormField } from '@common/models/formTypes';

import Swal from 'sweetalert2';
import { INFO_PROM } from '@common/constants/messages.constant';

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

  loading!: HTMLIonLoadingElement;

  form!: FormGroup;
  validationConfig: ValidationConfig[] = [];
  formFields: FormField[] = [];
  myButtons: Button[] = [];

  selectedCategories: string[] = [];
  productOptions: any[] = [];

  comboParam: DropdownParam[] = [
    {
      title: 'Categoria',
      fields: new Subject<EntityListResponse<any>>(),
      defaultValue: new Subject<string>(),
      isMultiple: true,
    },
    {
      title: 'Productos',
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
  showNotification() {
    Swal.fire(INFO_PROM);
  }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['idPromotion'];
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
    this.promotionService.getPromotion(this.id).subscribe(data => {
      this.form.get('description')?.setValue(data.description);
      this.form.get('price')?.setValue(data.price);
      if (data.discount !== undefined) {
        this.form.get('discount')?.setValue(data.discount * 100);
      }
      if (data.valid_from !== undefined) {
        const validFromDate = new Date(data.valid_from);
        this.form
          .get('valid_from')
          ?.setValue(validFromDate.toISOString().split('T')[0]);
      }
      if (data.valid_to !== undefined) {
        const validFromDate = new Date(data.valid_to);
        this.form
          .get('valid_to')
          ?.setValue(validFromDate.toISOString().split('T')[0]);
      }
      this.form.get('baja')?.setValue(data.baja);
      //this.comboParam[0].defaultValue!.next(data.category!);
      //this.form.controls['Categoria']?.setValue(this.idCat);
    });
  }

  async loadProducts(selectedCategories: string[]) {
    if (selectedCategories.length > 0) {
      this.loading = await this.loadingService.loading();
      await this.loading.present();
    }
    selectedCategories.forEach(categoryId => {
      this.productsTypeService.getProductsType(categoryId).subscribe(data => {
        this.productsService
          .getProducts(undefined, undefined, data.description)
          .subscribe(productsResponse => {
            this.comboParam[1].fields!.next(productsResponse);
            if (this.id) this.autocompleteForm();
            else {
              const prod = productsResponse.results;
              this.comboParam[1].defaultValue!.next(prod[1]?.name!);
              this.form.controls['Productos']?.setValue(prod[1]?.id);
            }
            this.loading.dismiss();
          });
      });
    });
  }

  async loadCombos() {
    this.loading = await this.loadingService.loading();
    await this.loading.present();
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
      this.form
        .get('Categoria')
        ?.valueChanges.subscribe((selectedCategories: string[]) => {
          this.selectedCategories = selectedCategories;

          this.loadProducts(this.selectedCategories);
        });

      this.loading.dismiss();
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
        label: 'Descuento',
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
    ];
  }
}
