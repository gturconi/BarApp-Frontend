import { Injectable } from "@angular/core";
import { Products } from "src/app/projects/menu/products/models/products";

@Injectable({
  providedIn: "root",
})
export class CartService {
  constructor() {}
  private cart: Products[] = [];

  addToCart(item: Products) {
    this.getCart();

    let index = this.cart.findIndex(x => x.id === item.id);
    if (index === -1) {
      this.cart.push(item);
    } else {
      this.cart[index].quantity! += item.quantity!;
    }
    this.updateLocalStorage();
  }

  isProductInCart(id: string): boolean {
    this.getCart();

    let index = this.cart.findIndex(x => x.id == id);

    if (index === -1) {
      return false;
    } else {
      return true;
    }
  }

  removeFromCart(id: string) {
    this.getCart();

    this.cart = this.cart.filter(x => x.id != id);
    this.updateLocalStorage();
  }

  getCart() {
    let cartStr = localStorage.getItem("cart");
    this.cart = cartStr ? JSON.parse(cartStr) : [];
  }

  updateLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  clearCart() {
    this.cart = [];
    this.updateLocalStorage();
  }
}
