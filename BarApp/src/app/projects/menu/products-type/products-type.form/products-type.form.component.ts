import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { finalize } from "rxjs/operators";
import { ChangeDetectionStrategy } from "@angular/core";

import { ProductsTypeService } from "../services/products-type.service";
import { NotificationService } from "@common/services/notification.service";
import { LoadingService } from "@common/services/loading.service";
import { ImageService } from "@common/services/image.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-products-type.form",
  templateUrl: "./products-type.form.component.html",
  styleUrls: ["./products-type.form.component.scss"],
})
export class ProductsTypeFormComponent implements OnInit {
  id = "";
  formTitle = "Añadir Categoría";
  editMode = false;
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsTypeService: ProductsTypeService,
    private notificationService: NotificationService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params["id"];
      if (this.id) {
        this.editMode = true;
        this.formTitle = "Editar Categoría";
         this.autocompleteForm();
      }
    });
  }

  async autocompleteForm() {
    this.productsTypeService.getProductsType(this.id).subscribe(data => {
      this.form.get("description")?.setValue(data.description);   
    });
  }

  setForm(form: FormGroup): void {
    this.form = form;
  }

  async add(form: FormGroup) {
    const fileControl = form.controls["image"];
    const imageFile: File = fileControl.value;

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append('description', form.controls["description"].value);

    const loading = await this.loadingService.loading();
    await loading.present();
    this.productsTypeService.postProductsTypes(formData)
    .pipe(finalize(() => loading.dismiss()))
    .subscribe(
      () => {
        this.notificationService.presentToast({
          message: "Categoría anadida",
          duration: 2500,
          color: "ion-color-success",
          position: "middle",
          icon: "alert-circle-outline",
        })
        loading.dismiss();
        this.router.navigate(["/menu/categories"]);
      }
    )
  }

  async edit(form: FormGroup) {
    let imageFile = null;    
    const formData = new FormData();

    const fileControl = form.controls["image"];
    if(fileControl.value){
      imageFile = fileControl.value;
      formData.append("image", imageFile);
    }
    formData.append('description', form.controls["description"].value);

    const loading = await this.loadingService.loading();
    await loading.present();
    this.productsTypeService.putProductsTypes(this.id, formData)
    .pipe(finalize(() => loading.dismiss()))
    .subscribe(
      () => {
        this.notificationService.presentToast({
          message: "Categoría editada",
          duration: 2500,
          color: "ion-color-success",
          position: "middle",
          icon: "alert-circle-outline",
        })
        loading.dismiss();
        this.router.navigate(["/menu/categories"]);
      }
    )
  }

  formFields = [
    {
      type: "input",
      name: "description",
      label: "Descripción",
      inputType: "text",
      icon: "material-symbols-outlined",
      iconName: "restaurant",
    },
    {
      type: "input",
      name: "image",
      label: "Imagen",
      inputType: "file",
    },
  ];

  myButtons = [
    {
      label: this.editMode ? "Editar" : "Añadir",
      type: "submit",
      routerLink: "",
      icon: "add-circle-outline",
    },
  ];

  validationConfig = [
    { controlName: "description", required: true },
    { controlName: "image", required: this.editMode!},
  ];
}
