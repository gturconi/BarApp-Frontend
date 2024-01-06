import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showMenu: boolean = false;

  constructor() {}

  onMenuToggle(showMenu: boolean) {
    this.showMenu = showMenu;
  }
}
