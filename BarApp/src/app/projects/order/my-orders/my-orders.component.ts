import { Component, OnInit } from '@angular/core';

import { BadgeService } from '@common/services/badge.service';
import { CartService } from '@common/services/cart.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
})
export class MyOrdersComponent implements OnInit {
  constructor(
    private badgeService: BadgeService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.badgeService.resetBadgeCount();
    this.cartService.setVisited();
  }
}
