import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { finalize, switchMap } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';
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
import { DaysOfWeek } from '@common/constants/days.of.week.enum';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-promotions-form',
  templateUrl: './promotions-form.component.html',
  styleUrls: ['./promotions-form.component.scss'],
})
export class PromotionsFormComponent implements OnInit {
  id = '';
  idCat = '';
  formTitle = 'Añadir Promoción';
  editMode = false;
  days: number[] = [];

  loading!: HTMLIonLoadingElement;

  form!: FormGroup;
  validationConfig: ValidationConfig[] = [];
  formFields: FormField[] = [];
  myButtons: Button[] = [];

  selectedCategories: string[] = [];
  productsList: EntityListResponse<Products>[] = [];
  productOptions: any[] = [];

  products: string[] = [];
  product!: Products;

  mobileScreen = false;

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
    {
      title: 'Dias',
      fields: new Subject<any>(),
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
      this.mobileScreen = window.innerWidth < 768;
    });
  }

  async autocompleteForm() {
    this.promotionService.getPromotion(this.id).subscribe(data => {
      this.form.get('description')?.setValue(data.description);
      if (!data.price) {
        this.form.get('price')?.setValue(undefined);
      } else this.form.get('price')?.setValue(data.price);
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

      const prods = data.products;
      const categories: string[] = [];
      const IDcategories: string[] = [];
      if (prods) {
        prods.forEach(prod => {
          this.productsService.getProduct(prod.id).subscribe(productData => {
            if (productData.category && productData.idCat) {
              const productCategory: string = productData.category;
              const categoryID: string = productData.idCat;
              if (
                categories.indexOf(productCategory) === -1 &&
                IDcategories.indexOf(categoryID) === -1
              ) {
                categories.push(productCategory);
                IDcategories.push(categoryID);
              }
            }
          });
        });
      }

      this.selectedCategories = IDcategories;

      this.loadProducts();

      this.comboParam[0].defaultValue!.next(categories);
      this.form.controls['Categoria']?.setValue(IDcategories);

      this.comboParam[1].defaultValue!.next(prods!.map(p => p.name));
      this.form.controls['Productos']?.setValue(prods!.map(p => p.id));

      let nameDays: string[] | undefined;
      const days = data.days_of_week;
      if (days) {
        nameDays = this.numbersToDaysOfWeek(days);
      }

      this.comboParam[2].defaultValue!.next(nameDays);
      this.form.controls['Dias']?.setValue(nameDays);
    });
  }

  numbersToDaysOfWeek(numberDays: number[]): string[] {
    const nameDaysOfWeek: string[] = [];
    numberDays.forEach(numDay => {
      const day = Object.values(DaysOfWeek)[numDay];
      if (day) {
        nameDaysOfWeek.push(day);
      }
    });
    return nameDaysOfWeek;
  }

  async loadProducts() {
    let res: EntityListResponse<Products>;
    this.productsList = [];

    this.selectedCategories = this.form.controls['Categoria'].value;
    if (this.selectedCategories.length > 0) {
      this.loading = await this.loadingService.loading();
      await this.loading.present();
    }

    const requests = this.selectedCategories.map(categoryId =>
      this.productsTypeService
        .getProductsType(categoryId)
        .pipe(
          switchMap(data =>
            this.productsService.getProducts(
              undefined,
              undefined,
              data.description
            )
          )
        )
    );

    forkJoin(requests)
      .pipe(
        finalize(() => {
          const combinedResults: Products[] = [];
          const resultSet = new Set<Products>();
          this.productsList.map(productsResponse => {
            productsResponse.results.forEach(result => {
              !result.baja && result.stock && resultSet.add(result);
            });
          });
          resultSet.forEach(result => combinedResults.push(result));

          res = new EntityListResponse(
            combinedResults.length,
            combinedResults,
            1,
            1
          );
          if (res.count > 0) this.form.controls['Productos']?.enable();
          else if (!this.id) this.form.controls['Productos']?.disable();
          this.comboParam[1].fields!.next(res);

          const prod = this.productsList[0].results;
          if (!this.id) {
            this.comboParam[1].defaultValue!.next(prod[0]?.name!);
            this.form.controls['Productos']?.setValue(prod[0]?.id);
          }

          this.loading.dismiss();
        })
      )
      .subscribe(
        productsResponses => {
          productsResponses.forEach(productsResponse => {
            this.productsList.push(productsResponse);
          });
          this.loading.dismiss();
        },
        (error: any) => {
          this.loading.dismiss();
        }
      );
  }

  loadDays() {
    const daysOfWeek = Object.keys(DaysOfWeek).map(key => ({
      id: key,
      description: key,
    }));

    const res = new EntityListResponse(daysOfWeek.length, daysOfWeek, 1, 1);

    this.comboParam[2].fields!.next(res);

    const days = res.results;
    this.comboParam[2].defaultValue!.next(days[0]?.description!);
    //this.form.controls['Dias']?.setValue(days[0]?.id);
  }

  async loadCombos() {
    this.loading = await this.loadingService.loading();
    await this.loading.present();
    this.loadDays();
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

          this.loadProducts();
        });
      if (!this.id) this.form.controls['Productos']?.disable();
      this.loading.dismiss();
    });
  }

  setForm(form: FormGroup): void {
    this.form = form;
  }

  async add(form: FormGroup) {
    const fileControl = form.controls['image'];
    const imageFile: File = fileControl.value;
    const baja = form.controls['baja'].value ? 1 : 0;
    const discountValue = form.controls['discount'].value / 100;
    const price = form.controls['price'].value;
    const products: string[] = form.controls['Productos'].value;

    this.products = products;

    const daysArray = Object.values(DaysOfWeek);

    const days = (form.controls['Dias'].value as String[]).map(day =>
      daysArray.findIndex(dayOfWeek => dayOfWeek === day)
    );

    if (!price && !discountValue) {
      this.toastrService.error(
        'Debe completar al menos uno de los campos: Precio o Descuento.'
      );
      return;
    }

    if (
      !(
        form.controls['valid_from'].value ||
        form.controls['valid_to'].value ||
        days.length > 0
      )
    ) {
      this.toastrService.error(
        'Debe seleccionar al menos una rango de fecha o días de la semana.'
      );
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('description', form.controls['description'].value);
    formData.append('price', form.controls['price'].value);
    formData.append('discount', discountValue.toString());
    formData.append('valid_from', form.controls['valid_from'].value);
    formData.append('valid_to', form.controls['valid_to'].value);
    formData.append('baja', baja.toString());
    formData.append('products', JSON.stringify(products));
    formData.append('days_of_week', JSON.stringify(days));

    const loading = await this.loadingService.loading();
    await loading.present();
    this.promotionService
      .postPromotions(formData)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(() => {
        this.toastrService.success('Promoción añadida');
        loading.dismiss();
        this.location.back();
      });
  }

  async edit(form: FormGroup) {
    let imageFile = null;
    const baja = form.controls['baja'].value ? 1 : 0;
    const discountValue = form.controls['discount'].value / 100;
    let price = form.controls['price'].value;
    const products: string[] = form.controls['Productos'].value;
    const daysArray = Object.values(DaysOfWeek);
    const days = (form.controls['Dias'].value as String[]).map(day =>
      daysArray.findIndex(dayOfWeek => dayOfWeek === day)
    );

    if (!price && !discountValue) {
      this.toastrService.error(
        'Debe completar al menos uno de los campos: Precio o Descuento.'
      );
      return;
    }

    if (
      !(
        form.controls['valid_from'].value ||
        form.controls['valid_to'].value ||
        days.length > 0
      )
    ) {
      this.toastrService.error(
        'Debe seleccionar al menos una rango de fecha o días de la semana.'
      );
      return;
    }

    const formData = new FormData();
    const fileControl = form.controls['image'];
    if (fileControl.value) {
      imageFile = fileControl.value;
      formData.append('image', imageFile);
    }
    formData.append('description', form.controls['description'].value);
    formData.append('price', price);
    formData.append('discount', discountValue.toString());
    formData.append('valid_from', form.controls['valid_from'].value);
    formData.append('valid_to', form.controls['valid_to'].value);
    formData.append('baja', baja.toString());
    formData.append('products', JSON.stringify(products));
    formData.append('days_of_week', JSON.stringify(days));

    const loading = await this.loadingService.loading();
    await loading.present();
    this.promotionService
      .putPromotions(this.id, formData)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(() => {
        this.toastrService.success('Promoción editada');
        loading.dismiss();
        this.location.back();
      });
  }

  setFormInputs() {
    this.formFields = [
      {
        type: 'textarea',
        name: 'description',
        label: 'Descripción',
        inputType: 'textarea',
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
      { controlName: 'Categoria', required: true },
      { controlName: 'Productos', required: true },
      { controlName: 'Dias' },
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
