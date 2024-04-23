import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { LoginService } from '@common/services/login.service';
import { UserRoles } from '@common/constants/user.roles.enum';
import { Input } from '@angular/core';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import {
  CALL_WAITER,
  NO_WEB_QR_COMPATIBILITY,
} from '@common/constants/messages.constant';
import { OrderService } from 'src/app/projects/order/services/order.service';
import { ORDER_STATES } from 'src/app/projects/order/models/order';
import { formatDate } from '@angular/common';
import { BarcodeScanningModalComponent } from 'src/app/projects/order/my-orders/barcode-scanning-modal.component';
import { ModalController } from '@ionic/angular';
import { LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { FcmService } from '@common/services/fcm.service';
import { Capacitor } from '@capacitor/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() showMenu: boolean = false;
  showBackButton: boolean = false;
  client: boolean = false;
  scannedData = '';

  onMenuToggle(showMenu: boolean) {
    this.showMenu = showMenu;
  }

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loginService: LoginService,
    private location: Location,
    private orderService: OrderService,
    private modalController: ModalController,
    private fmcService: FcmService,
    private toastrService: ToastrService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd || event instanceof NavigationStart) {
        this.updateBackButtonVisibility(this.router.url);
      }
    });
  }

  isAdmin(): boolean {
    const userLoggedIn = this.loginService.isLoggedIn();
    const userRole = userLoggedIn ? this.loginService.getUserRole() : null;
    return userLoggedIn && userRole === UserRoles.Admin;
  }

  ngOnInit() {
    this.updateBackButtonVisibility(this.router.url);
  }

  updateBackButtonVisibility(url: string) {
    this.client = this.loginService.isClient();
    this.showBackButton = !['/home', '/intro'].includes(url);
    this.cdr.detectChanges();
  }

  goBack(): void {
    this.location.back();
  }

  callWaiter() {
    if (Capacitor.getPlatform() !== 'web') {
      let userOrders = [];
      Swal.fire(CALL_WAITER).then(async result => {
        if (result.isConfirmed) {
          let user = this.loginService.getUserInfo();
          if (!user) {
            return;
          }
          this.orderService
            .getUserOrders(user.id, 1, 10, user.name)
            .subscribe(async data => {
              userOrders = data.results;
              if (
                userOrders.some(
                  order =>
                    order.state.description != ORDER_STATES[4] &&
                    this.isTodayOrder(order.date_created)
                )
              ) {
                this.sendNotification(userOrders[0].table_order.number);
              } else {
                if (await this.scanCode()) {
                  this.orderService.checkQR(this.scannedData).subscribe(res => {
                    if (res.message == 'Codigo validado') {
                      this.sendNotification();
                    }
                  });
                }
              }
            });
        }
      });
    } else {
      Swal.fire(NO_WEB_QR_COMPATIBILITY);
      return;
    }
  }

  sendNotification(table?: number) {
    if (table) {
      this.fmcService
        .sendPushNotification(
          'Solicitud de asistencia en mesa',
          `Un cliente en la mesa ${table} ha solicitado tu asistencia. Por favor, acude a atenderlo lo antes posible`
        )
        .subscribe(() =>
          this.toastrService.success('Alerta enviada, en breve será atendido')
        );
    } else {
      this.fmcService
        .sendPushNotification(
          'Solicitud de asistencia en mesa X',
          `Un cliente en la mesa X ha solicitado tu asistencia. Por favor, acude a atenderlo lo antes posible`,
          this.scannedData
        )
        .subscribe(() =>
          this.toastrService.success('Alerta enviada, en breve será atendido')
        );
    }
  }

  async scanCode() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal', //transparent background
      showBackdrop: false,
      componentProps: {
        formats: [],
        lensFacing: LensFacing.Back, //back camera
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.scannedData = data?.barcode?.displayValue;
      return true;
    }
    return false;
  }

  isTodayOrder(orderDate: string): boolean {
    const today = new Date();
    const formattedOrderDate = formatDate(orderDate, 'yyyy-MM-dd', 'en');
    const formattedToday = formatDate(today, 'yyyy-MM-dd', 'en');
    return formattedOrderDate === formattedToday;
  }
}
