import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { formatDate } from '@angular/common';
import { Location } from '@angular/common';

import { LoginService } from '@common/services/login.service';
import { OrderService } from '../services/order.service';
import { LoadingService } from '@common/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../../menu/products/services/products.service';
import { PromotionsService } from '../../menu/promotions/services/promotions.service';
import { SocketService } from '@common/services/socket.service';
import { FcmService } from '@common/services/fcm.service';
import { TablesService } from '../../tables/services/tables.service';
import { ModalComponent } from '@common-ui/modal/modalComponent';

import {
  ORDER_STATES,
  PAYMENT_METHOD,
  OrderRequest,
  OrderResponse,
} from '../models/order';
import {
  CANCEL_ORDER,
  CHANGE_ORDER_STATUS,
  COMPLETE_QUIZ,
  VACATE_TABLE_CLIENT,
} from '@common/constants/messages.constant';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { File } from '@awesome-cordova-plugins/file';
import { FileOpener } from '@awesome-cordova-plugins/file-opener';
import { ModalController, Platform } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { Table } from '../../tables/models/table';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-order.details',
  templateUrl: './order.details.component.html',
  styleUrls: ['./order.details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  admin: boolean = false;
  role = '';
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
    private toastrService: ToastrService,
    private socketService: SocketService,
    private platform: Platform,
    private location: Location,
    private fmcService: FcmService,
    private tablesService: TablesService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.admin = this.loginService.isAdmin();
    this.role = this.loginService.getUserRole();

    this.route.params.subscribe(async params => {
      const orderId = params['idOrder'];
      if (orderId) {
        this.orderId = orderId;
        this.doSearch(orderId);
      }
    });
    this.route.queryParams.subscribe(params => {
      if (params['success'] === 'true') {
        Swal.fire(VACATE_TABLE_CLIENT).then(async result => {
          if (result.isConfirmed) {
            this.vacateTable();
            Swal.fire(COMPLETE_QUIZ).then(async result => {
              if (result.isConfirmed) this.openQuizModal();
              else this.doSearch(this.orderId!);
            });
          } else {
            this.doSearch(this.orderId!);
          }
        });
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
    this.orderDetails = [];
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
      Swal.fire(CANCEL_ORDER).then(async result => {
        if (result.isConfirmed) {
          const loading = await this.loadingService.loading();
          await loading.present();
          this.orderService
            .deleteOrder(this.orderId!)
            .pipe(finalize(() => loading.dismiss()))
            .subscribe(() => {
              this.toastrService.success('Pedido cancelado');
              this.socketService.sendMessage('order', '');
              loading.dismiss();
              this.fmcService
                .sendPushNotification(
                  'Pedido cancelado',
                  `Se ha cancelado un pedido en la mesa ${this.order?.table_order.number}`
                )
                .subscribe(() =>
                  this.toastrService.success('Pedido cancelado')
                );
              this.router.navigate(['orders/my-orders/confirmed']);
            });
        }
      });
    }
  }

  async changeOrderStatus(stateID: string) {
    const confirmResult = await Swal.fire(CHANGE_ORDER_STATUS);
    if (confirmResult.isConfirmed) {
      if (stateID && this.order) {
        let stateId: string;
        switch (this.order.state.description) {
          case 'A confirmar':
            stateId = '2';
            break;
          case 'En preparación':
            stateId = '3';
            break;
          case 'Entregado':
            this.payCash();
            return;
          default:
            stateId = stateID;
            break;
        }
        const orderRequest: OrderRequest = {
          tableId: this.order.table_order.id.toString(),
          userId: this.order.user.id.toString(),
          idState: stateId,
          total: this.order.total,
          orderDetails: this.order.orderDetails,
          employeeId:
            stateId === '2' ? this.loginService.getUserInfo().id : null,
        };
        const loading = await this.loadingService.loading();
        await loading.present();
        this.orderService
          .putOrder(this.order.id.toString(), orderRequest)
          .pipe(finalize(() => loading.dismiss()))
          .subscribe(() => {
            this.toastrService.success('Estado del pedido actualizado');
            loading.dismiss();
            this.fmcService
              .sendPushNotification(
                'Estado del pedido actualizado',
                stateId == '2'
                  ? 'El pedido ya se encuentra en preparación'
                  : 'El pedido ya fue entregado',
                undefined,
                this.order?.user.id.toString()
              )
              .subscribe(() =>
                this.toastrService.success('Estado del pedido actualizado')
              );
            this.location.back();
          });
      }
    }
  }

  handleOrderAction(): void {
    if (this.order!.state.description === ORDER_STATES[1]) {
      this.cancelOrder();
    } else if (this.order!.state.description === ORDER_STATES[3]) {
      Swal.fire(PAYMENT_METHOD).then(result => {
        if (result.isConfirmed) {
          this.payMP();
        } else {
          this.fmcService
            .sendPushNotification(
              'Solicitud de asistencia en mesa',
              `Un cliente en la mesa ${this.order?.table_order.number} ha solicitado tu asistencia. Por favor, acude a atenderlo lo antes posible`
            )
            .subscribe(() =>
              this.toastrService.success(
                'Alerta enviada, en breve será atendido'
              )
            );
          this.toastrService.success('Alerta enviada, en breve será atendido');
          Swal.fire(COMPLETE_QUIZ).then(async result => {
            if (result.isConfirmed) this.openQuizModal();
          });
        }
      });
    }
  }

  async openQuizModal() {
    let items: {
      key: string;
      value: string;
      link: string;
      range?: boolean;
      textArea?: boolean;
    }[] = [];
    items.push({
      key: 'Calificacion: ',
      value: '',
      link: '',
      range: true,
    });
    items.push({
      key: 'Comentario',
      value: '',
      link: '',
      textArea: true,
    });

    await this.openModal({
      title: 'Encuesta',
      items: items,
      button: {
        title: 'Enviar',
        fn: (rangeValue: number, textAreaValue: string) =>
          this.sendQuiz(rangeValue, textAreaValue),
      },
    });
  }

  async sendQuiz(rangeValue: number, textAreaValue: string) {
    if (this.order) {
      const orderRequest: OrderRequest = {
        tableId: this.order.table_order.id.toString(),
        userId: this.order.user.id.toString(),
        idState: this.order.state.id.toString(),
        total: this.order.total,
        orderDetails: this.order.orderDetails,
        feedback: textAreaValue,
        score: rangeValue,
      };
      const loading = await this.loadingService.loading();
      await loading.present();
      this.orderService
        .putOrderQuiz(this.order.id.toString(), orderRequest)
        .pipe(
          finalize(() => {
            loading.dismiss();
            this.doSearch(this.orderId!);
          })
        )
        .subscribe(() => {
          this.toastrService.success('¡Gracias por completar la encuesta!');
          loading.dismiss();
          this.location.back();
        });
    }
  }

  async openModal(data: any) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        title: data.title,
        items: data.items,
        button: data.button,
      },
    });
    await modal.present();
  }

  async payMP() {
    const loading = await this.loadingService.loading();
    await loading.present();
    this.orderService
      .payOrder(this.orderId!)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(async link => {
        if (this.platform.is('capacitor')) {
          await Browser.open({ url: link })
            .then(() => {})
            .finally(() => loading.dismiss());
        } else {
          window.open(link, '_blank');
        }
      });
  }

  async payCash() {
    const loading = await this.loadingService.loading();
    await loading.present();
    this.orderService
      .payOrderCash(this.orderId!)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(() => {
        this.socketService.sendMessage('order', '');
        this.fmcService
          .sendPushNotification(
            'Pedido pagado en efectivo/otro',
            '¡Gracias por elegirnos!',
            undefined,
            this.order?.user.id.toString()
          )
          .subscribe(() =>
            this.toastrService.success('Pedido pagado en efectivo/otro')
          );
        loading.dismiss();
        this.location.back();
      });
  }

  getCurrentDate(): Date {
    return new Date();
  }

  isTodayOrder(orderDate: string): boolean {
    const today = new Date();
    const formattedOrderDate = new Date(orderDate);
    const formattedToday = formatDate(today, 'yyyy-MM-dd', 'en');
    const formattedOrder = formatDate(formattedOrderDate, 'yyyy-MM-dd', 'en');
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const formattedYesterday = formatDate(yesterday, 'yyyy-MM-dd', 'en');
    return (
      formattedOrder === formattedToday || formattedOrder === formattedYesterday
    );
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
      },
      { text: this.getPaymentMethod(), style: 'content' }
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
        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
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
        {
          width: '*',
          text: 'Total:',
          bold: true,
          alignment: 'right',
          fontSize: 11,
        },
        {
          width: '*',
          text: `$${this.order.total}`,
          bold: true,
          alignment: 'center',
          fontSize: 11,
        },
      ],
      margin: [125, 0, 145, 10],
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
    if (this.platform.is('capacitor')) {
      pdf.getBuffer(buffer => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        File.writeFile(File.dataDirectory, fileName, blob, {
          replace: true,
        }).then(fileEntry => {
          FileOpener.open(File.dataDirectory + fileName, 'application/pdf');
        });
      });
    } else pdf.download(fileName);
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  async vacateTable() {
    const loading = await this.loadingService.loading();
    await loading.present();
    let table = new Table(
      this.order?.table_order.id,
      this.order?.table_order.number,
      1
    );
    this.tablesService
      .updateState(table)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(res => {
        this.toastrService.success('Mesa desocupada');
        this.socketService.sendMessage('order', '');
        loading.dismiss();
      });
  }

  getPaymentMethod() {
    const method = this.order?.payment_method;
    if (method === PAYMENT_METHOD[1]) {
      return 'Pedido pagado por Mercado Pago';
    } else if (method === PAYMENT_METHOD[2]) {
      return 'Pedido pagado por Efectivo/Otro';
    }

    return '';
  }
}
