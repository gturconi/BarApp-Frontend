import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { LoginService } from '@common/services/login.service';
import { UserRoles } from '@common/constants/user.roles.enum';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  showBackButton: boolean = false;

  menuItems: any[] = [];

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
    private loginService: LoginService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd || event instanceof NavigationStart) {
        this.updateBackButtonVisibility(this.router.url);
      }
    });
  }

  ngOnInit() {
    this.updateBackButtonVisibility(this.router.url);
    this.updateMenu();
    /*para saber si esta logueado /TODO: borrarlo en un futuro*/
    const loggedIn = this.isLoggedIn();
    console.log('¿Estoy logueado?', loggedIn);
  }

  updateMenu() {
    const userLoggedIn = this.loginService.isLoggedIn();

    this.menuItems = [...this.commonItems];

    if (userLoggedIn && this.loginService.isClient()) {
      this.menuItems.push({ icon: 'log-out-outline', label: 'Cerrar Sesión' });
      this.menuItems.splice(
        1,
        0,
        { icon: 'person-circle-outline', label: 'Mi Perfil' },
        { icon: 'calendar-outline', label: 'Mis Reservas' },
        { icon: 'cart-outline', label: 'Mis Pedidos' }
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
    }
  }

  updateBackButtonVisibility(url: string) {
    this.showBackButton = !['/home', '/intro'].includes(url);
    this.cdr.detectChanges();
  }

  goBack(): void {
    window.history.back();
  }

  /*para saber si esta logueado /TODO: borrarlo en un futuro*/
  isLoggedIn() {
    return this.loginService.isLoggedIn();
  }

  isAdmin(): boolean {
    const userLoggedIn = this.loginService.isLoggedIn();
    const userRole = userLoggedIn ? this.loginService.getUserRole() : null;
    return userLoggedIn && userRole === UserRoles.Admin;
  }
}
