import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { LoginService } from '@common/services/login.service';
import { UserRoles } from '@common/constants/user.roles.enum';
import { Location } from '@angular/common';

import { Output, EventEmitter } from '@angular/core';
import { BadgeService } from '@common/services/badge.service';
import Swal from 'sweetalert2';
import { CALL_WAITER } from '@common/constants/messages.constant';

interface MenuItem {
  isSetting?: boolean;
  isManage: boolean;
  icon?: string;
  label: string;
  route?: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Output() menuToggled: EventEmitter<boolean> = new EventEmitter<boolean>();

  showBackButton: boolean = false;
  showDesktopMenu: boolean = true;
  isScreenSmall: boolean = false;
  admin: boolean = false;
  badgeValue = 0;
  client: boolean = false;

  menuItems: MenuItem[] = [];
  tabsItem: any[] = [];

  commonItems: any[] = [
    { icon: 'fast-food-outline', label: 'Carta', route: '/menu/categories' },
    { icon: 'mail-outline', label: 'Contacto', route: '/about' },
    { icon: 'help-outline', label: 'FAQs', route: '/faq' },
  ];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loginService: LoginService,
    private location: Location,
    private badgeService: BadgeService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd || event instanceof NavigationStart) {
        this.updateBackButtonVisibility(this.router.url);
      }
      if (
        (event instanceof NavigationStart || event instanceof NavigationEnd) &&
        this.router.url === '/auth'
      ) {
        this.updateMenu();
      }
    });
  }

  ngOnInit() {
    this.updateBackButtonVisibility(this.router.url);
    this.updateMenu();

    this.checkScreenSize();
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });

    const loggedIn = this.isLoggedIn();
    this.badgeService.getBadgeCount().subscribe(count => {
      this.badgeValue = count;
    });
  }

  checkScreenSize() {
    const screenWidth = window.innerWidth;
    this.isScreenSmall = screenWidth <= 768;

    if (this.isScreenSmall) {
      if (!this.isLoggedIn()) {
        this.showDesktopMenu = false;
      } else if (this.loginService.isAdmin()) {
        this.showDesktopMenu = true;
      } else {
        this.showDesktopMenu = screenWidth > 768;
      }
    } else {
      this.showDesktopMenu = true;
    }
  }
  toggleDesktopMenu(tabIcon: string) {
    if (tabIcon === 'ellipsis-vertical-sharp') {
      this.showDesktopMenu = true;
      this.menuToggled.emit(this.showDesktopMenu);
      setTimeout(() => {
        const menuButton = document.getElementById('menuButton');
        if (menuButton) {
          menuButton.click();
        }
      }, 0);
    } else {
      this.showDesktopMenu = false;
      this.menuToggled.emit(this.showDesktopMenu);
    }
  }

  handleMenuItemClick(menuItem: MenuItem) {
    if (menuItem.label === 'Cerrar Sesión') {
      this.logout();
    } else {
      if (this.loginService.isAdmin() || !this.isScreenSmall) {
        this.showDesktopMenu = true;
        this.menuToggled.emit(this.showDesktopMenu);
        this.toggleDesktopMenu('ellipsis-vertical-sharp');
      } else {
        this.showDesktopMenu = true;
        this.menuToggled.emit(this.showDesktopMenu);
        menuItem.icon && this.toggleDesktopMenu(menuItem.icon);
      }
    }
  }

  updateMenu() {
    this.badgeService.getBadgeCount().subscribe(count => {
      this.badgeValue = count;
    });

    this.admin = false;
    const userLoggedIn = this.loginService.isLoggedIn();

    this.menuItems = [...this.commonItems];
    this.tabsItem = [...this.commonItems];

    this.checkScreenSize();

    if (userLoggedIn && this.loginService.isClient()) {
      this.menuItems.push({
        icon: 'log-out-outline',
        label: 'Cerrar Sesión',
        isManage: false,
      });
      this.menuItems.splice(
        1,
        0,
        {
          icon: 'person-circle-outline',
          label: 'Mi Perfil',
          route: 'auth/profile',
          isManage: false,
        },
        {
          icon: 'calendar-outline',
          label: 'Reservas',
          route: 'booking/my-bookings',
          isManage: false,
        },
        {
          icon: 'bag-handle-outline',
          label: 'Pedidos',
          route: 'orders/my-orders/confirmed',
          isManage: false,
        },
        {
          icon: 'cart-outline',
          label: 'Carrito',
          route: 'orders/my-orders',
          isManage: false,
        }
      );
      this.tabsItem.splice(
        1,
        2,
        {
          icon: 'calendar-outline',
          label: 'Reservas',
          route: 'booking/my-bookings',
        },
        {
          icon: 'bag-handle-outline',
          label: 'Pedidos',
          route: 'orders/my-orders/confirmed',
        },
        { icon: 'cart-outline', label: 'Carrito', route: 'orders/my-orders' },
        { icon: 'ellipsis-vertical-sharp', label: '' }
      );
    } else if (userLoggedIn && this.loginService.isEmployee()) {
      this.menuItems.push({
        icon: 'log-out-outline',
        label: 'Cerrar Sesión',
        isManage: false,
      });
      this.menuItems.splice(
        1,
        0,
        {
          icon: 'person-circle-outline',
          label: 'Mi Perfil',
          route: 'auth/profile',
          isManage: false,
        },
        {
          icon: 'reader-outline',
          label: 'Pedidos Actuales',
          route: '/tables',
          isManage: false,
        },
        {
          icon: 'timer-outline',
          label: 'Historial de pedidos',
          route: 'orders/my-orders/confirmed',
          isManage: false,
        }
      );
      this.tabsItem.splice(
        1,
        3,
        { icon: 'reader-outline', label: 'Pedidos', route: '/tables' },
        {
          icon: 'timer-outline',
          label: 'Historial',
          route: 'orders/my-orders/confirmed',
        },
        { icon: 'ellipsis-vertical-sharp', label: '' }
      );
    } else if (userLoggedIn && this.loginService.isAdmin()) {
      this.admin = true;
      this.menuItems.push({
        icon: 'log-out-outline',
        label: 'Cerrar Sesión',
        isManage: false,
      });
      this.menuItems.splice(
        1,
        0,
        {
          icon: 'person-circle-outline',
          label: 'Mi Perfil',
          route: 'auth/profile',
          isManage: false,
        },
        {
          icon: 'timer-outline',
          label: 'Dashboard',
          route: '/dashboard',
          isManage: false,
        },
        { label: 'Usuarios', route: '/users', isManage: true },
        { label: 'Mesas', route: '/tables', isManage: true },
        { label: 'Cartas', route: '/menu/categories', isManage: true },
        { label: 'Pedidos', route: '/orders', isManage: true },
        { label: 'Reservas', route: '/booking', isManage: true },
        { label: 'Temas', route: '/themes', isManage: true, isSetting: true }
      );
    } else {
      this.menuItems.splice(0, 0, {
        icon: 'person-circle-outline',
        label: 'Iniciar Sesión',
        route: 'auth',
        isManage: false,
      });
      this.tabsItem.splice(this.tabsItem.length - 3, 0, {
        icon: 'person-circle-outline',
        label: 'Ingresar',
        route: '/auth',
      });
      this.tabsItem.splice(this.tabsItem.length - 1, 0, {
        icon: 'help-outline',
        label: 'FAQs',
        route: '/faq',
      });
      this.tabsItem.pop();
      this.tabsItem.push({ icon: 'ellipsis-vertical-sharp', label: '' });
    }
  }

  updateBackButtonVisibility(url: string) {
    this.client = this.loginService.isClient();
    this.showBackButton = !['/home', '/intro'].includes(url);
    this.cdr.detectChanges();
  }

  goBack(): void {
    this.location.back();
  }

  isLoggedIn() {
    return this.loginService.isLoggedIn();
  }

  isAdmin() {
    const userLoggedIn = this.loginService.isLoggedIn();
    const userRole = userLoggedIn ? this.loginService.getUserRole() : null;
    return userLoggedIn && userRole === UserRoles.Admin;
  }
  isClient() {
    const userLoggedIn = this.loginService.isLoggedIn();
    const userRole = userLoggedIn ? this.loginService.getUserRole() : null;
    return userLoggedIn && userRole === UserRoles.Client;
  }

  logout() {
    this.router.navigate(['/auth']);
    this.loginService.logout();
    this.menuToggled.emit(false);
  }

  hasManageItems(): boolean {
    return (this.menuItems as MenuItem[]).some(item => item && item.isManage);
  }
}
