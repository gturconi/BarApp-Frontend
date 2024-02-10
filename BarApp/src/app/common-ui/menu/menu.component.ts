import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { LoginService } from '@common/services/login.service';
import { UserRoles } from '@common/constants/user.roles.enum';
import { Location } from '@angular/common';

import { Output, EventEmitter } from '@angular/core';
import { BadgeService } from '@common/services/badge.service';

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
  admin = this.isAdmin();
  badgeValue = 0;

  menuItems: any[] = [];
  tabsItem: any[] = [];

  commonItems: any[] = [
    { icon: 'home-outline', label: 'Inicio', route: '/home' },
    { icon: 'fast-food-outline', label: 'Carta', route: '/menu/categories' },
    { icon: 'mail-outline', label: 'Contacto', route: '' },
    { icon: 'help-outline', label: 'FAQs', route: '/faq' },
  ];

  manageItems: any[] = [
    { label: 'Usuarios', route: '' },
    { label: 'Mesas', route: '' },
    { label: 'Categorías de Productos', route: '/menu/categories' },
    { label: 'Productos', route: '' },
    { label: 'Promociones', route: '/menu/categories' },
    { label: 'Cartas', route: '' },
  ];

  settingItems: any[] = [
    { label: 'Pantallas', route: '' },
    { label: 'Temas', route: '' },
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

  updateMenu() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && this.router.url === '/auth') {
        this.admin = this.isAdmin();
      }
    });

    this.badgeService.getBadgeCount().subscribe(count => {
      this.badgeValue = count;
    });

    const userLoggedIn = this.loginService.isLoggedIn();

    this.menuItems = [...this.commonItems];
    this.tabsItem = [...this.commonItems];

    this.checkScreenSize();

    if (userLoggedIn && this.loginService.isClient()) {
      this.menuItems.push({
        icon: 'log-out-outline',
        label: 'Cerrar Sesión',
      });
      this.menuItems.splice(
        1,
        0,
        {
          icon: 'person-circle-outline',
          label: 'Mi Perfil',
          route: 'auth/profile',
        },
        { icon: 'calendar-outline', label: 'Mis Reservas', route: '' },
        { icon: 'cart-outline', label: 'Mis Pedidos', route: '' }
      );
      this.tabsItem.splice(
        2,
        3,
        { icon: 'calendar-outline', label: 'Reservas', route: '' },
        { icon: 'cart-outline', label: 'Pedidos', route: '' },
        { icon: 'ellipsis-vertical-sharp', label: '' }
      );
    } else if (userLoggedIn && this.loginService.isEmployee()) {
      this.menuItems.push({ icon: 'log-out-outline', label: 'Cerrar Sesión' });
      this.menuItems.splice(
        1,
        0,
        {
          icon: 'person-circle-outline',
          label: 'Mi Perfil',
          route: 'auth/profile',
        },
        { icon: 'reader-outline', label: 'Pedidos Actuales', route: '' },
        { icon: 'timer-outline', label: 'Historial de pedidos', route: '' },
        {
          icon: 'notifications-outline',
          label: 'Notificación Estado',
          route: '',
        }
      );
      this.tabsItem.splice(
        1,
        3,
        { icon: 'reader-outline', label: 'Pedidos', route: '' },
        { icon: 'timer-outline', label: 'Historial', route: '' },
        { icon: 'notifications-outline', label: 'Notificación', route: '' },
        { icon: 'ellipsis-vertical-sharp', label: '' }
      );
    } else if (userLoggedIn && this.loginService.isAdmin()) {
      this.menuItems.push({ icon: 'log-out-outline', label: 'Cerrar Sesión' });
      this.menuItems.splice(
        1,
        0,
        {
          icon: 'person-circle-outline',
          label: 'Mi Perfil',
          route: 'auth/profile',
        },
        { icon: 'timer-outline', label: 'Dashboard', route: '' }
      );
    } else {
      this.menuItems.splice(1, 0, {
        icon: 'person-circle-outline',
        label: 'Iniciar Sesión',
        route: 'auth',
      });
      this.tabsItem.splice(this.tabsItem.length - 2, 0, {
        icon: 'cart-outline',
        label: 'Pedido',
        route: '',
      });
      this.tabsItem.pop();
      this.tabsItem.push({ icon: 'ellipsis-vertical-sharp', label: '' });
    }
  }

  updateBackButtonVisibility(url: string) {
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

  logout() {
    this.loginService.logout();
    this.router.navigate(['/auth']);
  }
}
