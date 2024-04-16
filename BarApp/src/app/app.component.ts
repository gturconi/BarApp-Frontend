import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoginService } from '@common/services/login.service';
import { ThemeService } from './projects/theme/themes/services/theme.service';
import { LoadingService } from '@common/services/loading.service';
import { ScreenOrientation } from '@capacitor/screen-orientation';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  showMenu: boolean = false;
  addMarginBottom: boolean = false;
  isAdmin: boolean = false;
  themeLoaded: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private themeService: ThemeService,
    private loadingService: LoadingService
  ) {}
  themeData: any;
  async ngOnInit() {
    await ScreenOrientation.lock({ orientation: 'portrait' });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/auth/profile') {
          this.isAdmin = this.loginService.isAdmin();
          this.addMarginBottom = !this.isAdmin;
        }
      }
    });

    this.themeService.getTheme(1).subscribe(async theme => {
      const loading = await this.loadingService.loading();
      await loading.present();
      this.applyStyles(theme.cssProperties);
      this.themeLoaded = true;
      loading.dismiss();
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
