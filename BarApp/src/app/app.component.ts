import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showMenu: boolean = false;

  onMenuToggle(showMenu: boolean) {
    this.showMenu = showMenu;
  }

  constructor() {}
}
