import { Injectable } from '@angular/core';
import { CartProduct } from '@common/models/cartProduct';
import { Products } from 'src/app/projects/menu/products/models/products';
import { Promotion } from 'src/app/projects/menu/promotions/models/promotion';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor() {}
  private cart: CartProduct[] = [];

  addToCart(item: Products | Promotion, comments?: string) {
    this.getCart();

    let index = this.cart.findIndex(x => x.product.id === item.id);
    if (index === -1) {
      this.cart.push({ product: item, visited: false, comments: comments });
    } else {
      this.cart[index].product.quantity! += item.quantity!;
    }
    this.updateLocalStorage();
  }

  isProductInCart(id: string): boolean {
    this.getCart();
    let index = this.cart.findIndex(x => x.product.id == id);

    return index !== -1;
  }

  removeFromCart(id: string) {
    this.getCart();

    this.cart = this.cart.filter(x => x.product.id !== id);
    this.updateLocalStorage();
  }

  getCart() {
    let cartStr = localStorage.getItem('cart');
    this.cart = cartStr ? JSON.parse(cartStr) : [];
  }

  updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  setVisited() {
    this.getCart();
    this.cart.forEach(item => (item.visited = true));
    this.updateLocalStorage();
  }

  clearCart() {
    this.cart = [];
    this.updateLocalStorage();
  }

  getProductsFromCart(): CartProduct[] {
    this.getCart();
    return this.cart;
  }
}
