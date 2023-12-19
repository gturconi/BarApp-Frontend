import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  showBackButton: boolean = false;

  menuItems: any[] = [
    { icon: 'person-outline', label: 'Iniciar Sesión' },
    { icon: 'calendar-outline', label: 'Reserva' },
    { icon: 'fast-food-outline', label: 'Carta' },
    { icon: 'mail-outline', label: 'Contacto' },
    { icon: 'help-outline', label: 'Preguntas Frecuentes' },
  ];

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd || event instanceof NavigationStart) {
        this.updateBackButtonVisibility(this.router.url);
      }
    });
  }

  ngOnInit() {
    this.updateBackButtonVisibility(this.router.url);
  }

  updateBackButtonVisibility(url: string) {
    this.showBackButton = !['/home', '/intro'].includes(url);
    this.cdr.detectChanges();
  }

  goBack(): void {
    window.history.back();
  }
}
