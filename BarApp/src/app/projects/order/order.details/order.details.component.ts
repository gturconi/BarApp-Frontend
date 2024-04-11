import { Component, OnInit } from '@angular/core';
import { LoginService } from '@common/services/login.service';
import { OrderService } from '../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@common/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DELETE_OPTS } from '@common/constants/messages.constant';
import { finalize } from 'rxjs';
import { ORDER_STATES, OrderResponse } from '../models/order';
import { ProductsService } from '../../menu/products/services/products.service';
import { PromotionsService } from '../../menu/promotions/services/promotions.service';
import { Products } from '../../menu/products/models/products';
import { Promotion } from '../../menu/promotions/models/promotion';

@Component({
  selector: 'app-order.details',
  templateUrl: './order.details.component.html',
  styleUrls: ['./order.details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  admin: boolean = false;
  error = false;
  orderId = null;
  order: OrderResponse | null = null;
  orderDetails: {
    name: string;
    price: number;
    quantity: number;
    comments: string;
  }[] = [];
  mobileScreen = false;
  comments: string[] = [];

  constructor(
    private loginService: LoginService,
    private orderService: OrderService,
    private productService: ProductsService,
    private promotionService: PromotionsService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.admin = this.loginService.isAdmin();
    this.route.params.subscribe(async params => {
      const orderId = params['idOrder'];
      if (orderId) {
        this.orderId = orderId;
        this.doSearch(orderId);
      }
    });
    this.mobileScreen = window.innerWidth < 768;
  }

  async doSearch(id: string) {
    const loading = await this.loadingService.loading();
    await loading.present();
    try {
      this.orderService.getOrder(id).subscribe(async data => {
        this.order = data;
        console.log(data);
        await this.getDetails();
      });
    } finally {
      loading.dismiss();
    }
  }

  toggleDetailName(event: MouseEvent) {
    const element = event.target as HTMLElement;
    element.classList.toggle('truncate');
  }

  showFullText = false;

  toggleFullText() {
    this.showFullText = !this.showFullText;
  }

  async getDetails() {
    this.order?.orderDetails.forEach(async orderDetail => {
      if (orderDetail.comments) {
        this.comments.push(orderDetail.comments);
      }

      if (orderDetail.productId) {
        this.productService
          .getProduct(orderDetail.productId)
          .subscribe(product => {
            this.orderDetails.push({
              name: product.name!,
              quantity: orderDetail.quantity!,
              price: product.price!,
              comments: orderDetail.comments!,
            });
          });
      } else {
        this.promotionService
          .getPromotion(orderDetail.promotionId!)
          .subscribe(promotion => {
            this.orderDetails.push({
              name: promotion.description!,
              quantity: orderDetail.quantity!,
              price: promotion.price!,
              comments: orderDetail.comments!,
            });
          });
      }
    });
  }

  showComment(comment: string) {
    Swal.fire({
      title: 'Comentario realizado:',
      text: comment,
      icon: 'info',
      confirmButtonText: 'Aceptar',
    });
  }

  async cancelOrder(): Promise<void> {
    if (this.order?.state.description != ORDER_STATES[1]) {
      this.toastrService.error(
        'No es posible cancelar un pedido que ya ha sido confirmado'
      );
    } else {
      Swal.fire(DELETE_OPTS).then(async result => {
        if (result.isConfirmed) {
          const loading = await this.loadingService.loading();
          await loading.present();
          this.orderService
            .deleteOrder(this.orderId!)
            .pipe(finalize(() => loading.dismiss()))
            .subscribe(() => {
              this.toastrService.success('Pedido cancelado');
              loading.dismiss();
              this.router.navigate(['/my-orders']);
            });
        }
      });
    }
  }
}
