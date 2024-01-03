import { Component } from '@angular/core';
import { LoginService } from '@common/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showMenu: boolean = false;
  admin: boolean = false;

  constructor(private loginService: LoginService) {
    this.admin = this.loginService.isAdmin();
  }

  onMenuToggle(showMenu: boolean) {
    this.showMenu = showMenu;
  }
}
