import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoginService } from '@common/services/login.service';
import { ThemeService } from './projects/theme/themes/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  showMenu: boolean = false;
  addMarginBottom: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private themeService: ThemeService
  ) {}
  themeData: any;
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/auth/profile') {
          this.isAdmin = this.loginService.isAdmin();
          this.addMarginBottom = !this.isAdmin;
        }
      }
    });

    this.themeService.getTheme(1).subscribe(theme => {
      this.applyStyles(theme.cssProperties);
      console.log(theme.cssProperties);
    });
  }

  applyStyles(cssProperties: string) {
    const root = document.documentElement;
    const properties = cssProperties.split(';').filter(Boolean);
    properties.forEach(property => {
      const [name, value] = property.split(':');
      root.style.setProperty(name.trim(), value.trim());
    });
  }

  onMenuToggle(showMenu: boolean) {
    this.showMenu = showMenu;
  }
}
