import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BadgeService {
  private badgeCount: BehaviorSubject<number>;

  constructor() {
    this.badgeCount = new BehaviorSubject<number>(
      JSON.parse(localStorage.getItem('cart') || '[]')?.length ?? 0
    );
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
