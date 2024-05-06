import { Component, OnInit, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoginService } from '@common/services/login.service';
import { ThemeService } from './projects/theme/themes/services/theme.service';
import { LoadingService } from '@common/services/loading.service';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Platform } from '@ionic/angular';
import { FcmService } from '@common/services/fcm.service';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { environment } from 'src/environments/environment';

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
    private loadingService: LoadingService,
    private platform: Platform,
    private fcmService: FcmService,
    private zone: NgZone
  ) {
    this.platform
      .ready()
      .then(() => {
        this.fcmService.initPush();
      })
      .catch(e => {
        console.log('error fcm: ', e);
      });

    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        // Example url: https://beerswift.app/tabs/tab2
        // slug = /tabs/tab2
        const domain = 'https://https://bar-app-frontend.vercel.app';
        const slug = event.url.split(domain).pop();
        if (slug) {
          this.router.navigateByUrl(slug);
        }
        // If no match, do nothing - let regular routing
        // logic take over
      });
    });
  }
  themeData: any;
  async ngOnInit() {
    if (this.platform.is('capacitor')) {
      await ScreenOrientation.lock({ orientation: 'portrait' });
    }

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
