import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { EntityListResponse } from '@common/models/entity.list.response';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

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

  constructor(public router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showBackButton = !(
          event.url === '/home' || event.url === '/intro'
        );
      }
    });
  }

  ngOnInit() {}

  goBack(): void {
    window.history.back();
  }
}
