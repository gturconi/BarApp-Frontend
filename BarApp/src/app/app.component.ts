import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoginService } from '@common/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  showMenu: boolean = false;
  addMarginBottom: boolean = false;
  isAdmin: boolean = false;

  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit() {
    this.isAdmin = this.loginService.isAdmin();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.addMarginBottom = event.url === '/auth/profile' && !this.isAdmin;
      }
    });
  }

  onMenuToggle(showMenu: boolean) {
    this.showMenu = showMenu;
  }
}
