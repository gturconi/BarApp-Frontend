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

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

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
  showFullText = false;

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
        await this.getDetails();
      });
    } finally {
      loading.dismiss();
    }
  }

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

  createPdf() {
    if (!this.order) {
      this.toastrService.error(
        'No hay datos de pedido disponibles para generar el PDF.'
      );
      return;
    }
    const pdfContent = [];
    pdfContent.push({ text: 'Comprobante Pedido', style: 'header' });
    pdfContent.push({ text: 'Realizado por TGD Net', style: 'subheader' });
    pdfContent.push(
      {
        text: `Pedido Nro: ${this.order.id}`,
        margin: [0, 10, 0, 0],
        style: 'content',
      },
      {
        text: `Nombre del Cliente: ${this.order.user.name}`,
        style: 'content',
      },
      {
        text: `Pedido realizado: ${this.formatDate(this.order.date_created)}`,
        style: 'content',
      },
      {
        text: `Mesa Número: ${this.order.table_order.number}`,
        style: 'content',
      },
      {
        text: `Estado del Pedido: ${this.order.state.description}`,
        style: 'content',
        margin: [0, 0, 0, 10],
      }
    );
    if (this.orderDetails && this.orderDetails.length > 0) {
      const tableBody = [['Producto / Promoción', 'Cantidad', 'Precio']];
      this.orderDetails.forEach(detail => {
        const shortName =
          detail.name.length > 30
            ? detail.name.slice(0, 30) + '...'
            : detail.name;
        tableBody.push([
          shortName,
          detail.quantity.toString(),
          `$${detail.price}`,
        ]);
      });
      pdfContent.push({
        table: {
          body: tableBody,
          widths: ['62%', '20%', '18%'], // para ancho de las columnas
        },
        margin: [145, 0, 145, 10],
        style: 'tableContent',
      });
    }

    // para colocar el total
    pdfContent.push({
      columns: [
        { width: '*', text: '', bold: true, alignment: 'right' },
        { width: '*', text: '', bold: true, alignment: 'right' },
        { width: '*', text: 'Total:', bold: true, alignment: 'right' },
        {
          width: '*',
          text: `$${this.order.total}`,
          bold: true,
          alignment: 'center',
        },
      ],
      margin: [145, 0, 125, 10],
    });

    // para la estructura del PDF
    const pdfDefinition: any = {
      content: pdfContent,
      pageMargins: [10, 10, 10, 10],
      styles: {
        header: {
          fontSize: 12,
          bold: true,
          alignment: 'center',
        },
        subheader: {
          fontSize: 11,
          margin: [0, 5, 0, 5],
          alignment: 'center',
        },
        content: {
          fontSize: 11,
          margin: [0, 2, 0, 2],
          alignment: 'center',
        },
        tableContent: {
          fontSize: 10,
        },
      },
    };

    const fileName = `pedido_${this.order.id}.pdf`;

    //para crear el PDF
    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.download(fileName);
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}
