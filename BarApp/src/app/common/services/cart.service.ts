import { Injectable } from "@angular/core";
import { Products } from "src/app/projects/menu/products/models/products";

@Injectable({
  providedIn: "root",
})
export class CartService {
  constructor() {}
  private cart: Products[] = [];

  addToCart(item: Products) {
    let cartStr = localStorage.getItem("cart");
    this.cart = cartStr ? JSON.parse(cartStr) : [];

    let index = this.cart.findIndex(x => x.id === item.id);
    if (index === -1) {
      this.cart.push(item);
    } else {
      this.cart[index].quantity! += item.quantity!;
    }
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }
}
