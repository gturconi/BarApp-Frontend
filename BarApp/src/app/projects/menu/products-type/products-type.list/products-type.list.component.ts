import { Component, OnInit } from "@angular/core";
import { ProductsTypeService } from "../services/products-type.service";

@Component({
  selector: "app-products-type.list",
  templateUrl: "./products-type.list.component.html",
  styleUrls: ["./products-type.list.component.scss"],
})
export class ProductsTypeListComponent implements OnInit {
  constructor(private productsTypeService: ProductsTypeService) {}

  ngOnInit() {
    this.productsTypeService.getProductsTypes().subscribe(data => {
      console.log(data);
    });
  }
}
