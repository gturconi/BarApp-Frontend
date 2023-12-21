import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { LoginService } from '@common/services/login.service';
import { UserRoles } from '@common/constants/user.roles.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  showBackButton: boolean = false;

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

  isAdmin(): boolean {
    const userLoggedIn = this.loginService.isLoggedIn();
    const userRole = userLoggedIn ? this.loginService.getUserRole() : null;
    return userLoggedIn && userRole === UserRoles.Admin;
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
