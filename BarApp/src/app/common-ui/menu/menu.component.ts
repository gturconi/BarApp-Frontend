import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { LoginService } from '@common/services/login.service';
import { UserRoles } from '@common/constants/user.roles.enum';
import { Location } from '@angular/common';

import { Output, EventEmitter } from '@angular/core';

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
  isAdminUser!: boolean;

  menuItems: any[] = [];
  tabsItem: any[] = [];

  commonItems: any[] = [
    { icon: 'home-outline', label: 'Inicio' },
    { icon: 'fast-food-outline', label: 'Carta' },
    { icon: 'mail-outline', label: 'Contacto' },
    { icon: 'help-outline', label: 'Preguntas Frecuentes' },
  ];

  manageItems: any[] = [
    { label: 'Usuarios' },
    { label: 'Mesas' },
    { label: 'Categorías de Productos' },
    { label: 'Productos' },
    { label: 'Promociones' },
    { label: 'Cartas' },
  ];

  settingItems: any[] = [{ label: 'Pantallas' }, { label: 'Temas' }];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loginService: LoginService,
    private location: Location
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
    this.isAdminUser = this.loginService.isAdmin();

    this.checkScreenSize();
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
    /*para saber si esta logueado /TODO: borrarlo en un futuro*/
    const loggedIn = this.isLoggedIn();
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
    const userLoggedIn = this.loginService.isLoggedIn();

    this.menuItems = [...this.commonItems];
    this.tabsItem = [...this.commonItems];

    this.checkScreenSize();

    if (userLoggedIn && this.loginService.isClient()) {
      this.menuItems.push({ icon: 'log-out-outline', label: 'Cerrar Sesión' });
      this.menuItems.splice(
        1,
        0,
        { icon: 'person-circle-outline', label: 'Mi Perfil' },
        { icon: 'calendar-outline', label: 'Mis Reservas' },
        { icon: 'cart-outline', label: 'Mis Pedidos' }
      );
      this.tabsItem.splice(
        2,
        3,
        { icon: 'calendar-outline', label: 'Reservas' },
        { icon: 'cart-outline', label: 'Pedidos' },
        { icon: 'ellipsis-vertical-sharp', label: '' }
      );
    } else if (userLoggedIn && this.loginService.isEmployee()) {
      this.menuItems.push({ icon: 'log-out-outline', label: 'Cerrar Sesión' });
      this.menuItems.splice(
        1,
        0,
        { icon: 'person-circle-outline', label: 'Mi Perfil' },
        { icon: 'reader-outline', label: 'Pedidos Actuales' },
        { icon: 'timer-outline', label: 'Historial de pedidos' },
        { icon: 'notifications-outline', label: 'Notificación Estado' }
      );
      this.tabsItem.splice(
        1,
        3,
        { icon: 'reader-outline', label: 'Pedidos' },
        { icon: 'timer-outline', label: 'Historial' },
        { icon: 'notifications-outline', label: 'Notificación' },
        { icon: 'ellipsis-vertical-sharp', label: '' }
      );
    } else if (userLoggedIn && this.loginService.isAdmin()) {
      this.menuItems.push({ icon: 'log-out-outline', label: 'Cerrar Sesión' });
      this.menuItems.splice(
        1,
        0,
        { icon: 'person-circle-outline', label: 'Mi Perfil' },
        { icon: 'timer-outline', label: 'Dashboard' }
      );
    } else {
      this.menuItems.splice(1, 0, {
        icon: 'person-circle-outline',
        label: 'Iniciar Sesión',
      });
      this.tabsItem.splice(this.tabsItem.length - 2, 0, {
        icon: 'cart-outline',
        label: 'Pedido',
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
}
