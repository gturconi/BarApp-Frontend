import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormGroup } from "@angular/forms";

import { ProductsTypeService } from "../services/products-type.service";
import { NotificationService } from "@common/services/notification.service";
import { LoadingService } from "@common/services/loading.service";

@Component({
  selector: "app-products-type.form",
  templateUrl: "./products-type.form.component.html",
  styleUrls: ["./products-type.form.component.scss"],
})
export class ProductsTypeFormComponent implements OnInit {
  id = "";
  formTitle = "Añadir Categoría";
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private productsTypeService: ProductsTypeService,
    private notificationService: NotificationService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params["id"];
      if (this.id) {
        // this.editMode = true;
        this.formTitle = "Editar Categoría";
        // this.autocompleteForm();
      }
    });
  }

  submit(form: FormGroup) {
    console.log(form);
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
      label: "Añadir",
      type: "submit",
      routerLink: "",
      icon: "add-circle-outline",
    },
  ];

  validationConfig = [
    { controlName: "description", required: true },
    { controlName: "image", required: true },
  ];
}
