import { Injectable } from '@angular/core';
import { CartProduct } from '@common/models/cartProduct';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BadgeService {
  private badgeCount: BehaviorSubject<number>;
  private cart: CartProduct[] = [];

  constructor() {
    const cartStr = localStorage.getItem('cart');
    this.cart = cartStr ? JSON.parse(cartStr) : [];
    const initialBadgeCount = this.cart.filter(item => !item.visited).length;
    this.badgeCount = new BehaviorSubject<number>(initialBadgeCount);
  }

  getBadgeCount() {
    return this.badgeCount.asObservable();
  }

  incrementBadgeCount() {
    const currentCount = this.badgeCount.value;
    this.badgeCount.next(currentCount + 1);
  }

  decrementBadgeCount() {
    const currentCount = this.badgeCount.value;
    if (currentCount > 0) {
      this.badgeCount.next(currentCount - 1);
    }
  }

  resetBadgeCount() {
    this.badgeCount.next(0);
  }
}
