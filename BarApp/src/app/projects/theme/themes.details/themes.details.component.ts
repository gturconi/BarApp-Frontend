import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../themes/services/theme.service';
import { LoadingService } from '@common/services/loading.service';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-themes-details',
  templateUrl: './themes.details.component.html',
  styleUrls: ['./themes.details.component.scss'],
})
export class ThemesDetailsComponent implements OnInit {
  id = 0;
  tituloTarjeta: string = '';
  imagenes: string[] = [];
  imagenesPorId: { [id: string]: string[] } = {
    '1': [
      '../../../../assets//img/themes/theme1/theme1-1.png',
      '../../../../assets//img/themes/theme1/theme1-2.png',
      '../../../../assets//img/themes/theme1/theme1-3.png',
      '../../../../assets//img/themes/theme1/theme1-4.png',
      '../../../../assets//img/themes/theme1/theme1-5.png',
    ],
    '2': [
      '../../../../assets//img/themes/theme2/theme2-1.png',
      '../../../../assets//img/themes/theme2/theme2-2.png',
      '../../../../assets//img/themes/theme2/theme2-3.png',
      '../../../../assets//img/themes/theme2/theme2-4.png',
      '../../../../assets//img/themes/theme2/theme2-5.png',
    ],
    '3': [
      '../../../../assets//img/themes/theme3/theme3-1.png',
      '../../../../assets//img/themes/theme3/theme3-2.png',
      '../../../../assets//img/themes/theme3/theme3-3.png',
      '../../../../assets//img/themes/theme3/theme3-4.png',
      '../../../../assets//img/themes/theme3/theme3-5.png',
    ],
    '4': [
      '../../../../assets//img/themes/theme4/theme4-1.png',
      '../../../../assets//img/themes/theme4/theme4-2.png',
      '../../../../assets//img/themes/theme4/theme4-3.png',
      '../../../../assets//img/themes/theme4/theme4-4.png',
      '../../../../assets//img/themes/theme4/theme4-5.png',
    ],
  };

  constructor(
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private loadingService: LoadingService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (this.imagenesPorId[id]) {
        this.imagenes = this.imagenesPorId[id];
        setTimeout(() => {
          this.setupSlider();
        });
      }
    });
    this.route.queryParams.subscribe(params => {
      this.tituloTarjeta = params['titulo'];
    });
  }

  async handleChangeTheme() {
    this.id = this.route.snapshot.params['id'];
    let cssProperties;
    switch (this.id.toString()) {
      case '1':
        cssProperties =
          '--color-1:rgb(235,139,101);--color-2:#da6047;--color-3:#f9dfbc;--color-4:#f6cd8f;--color-5:#ec9819;--color-6:#f0ad48;--color-7:#ffff;--color-8:#1a1b1f;--color-9:#008f39;--color-10:#cc0000;--color-11:#dc2d22;--color-12:#d53032;--color-13:#717d7e;--color-pending: #717d7e;--color-preparation: #68a4d1;--color-delivered: #1e4f7f;--color-paid: #008f39;';
        break;
      case '2':
        cssProperties =
          '--color-1:#3a80b8;--color-2:#2b5797;--color-3:#a7c8e8;--color-4:#68a4d1;--color-5:#1e4f7f;--color-6:#3d88c7;--color-7:#ffff;--color-8:#1a1b1f;--color-9:#008f39;--color-10:#cc0000;--color-11:#a7c8e8;--color-12:#d53032--color-pending: #717d7e;--color-preparation: #68a4d1;--color-delivered: #1e4f7f;--color-paid: #008f39;';
        break;
      case '3':
        cssProperties =
          '--color-1: #5d3fd3; --color-2: #7c4dff; --color-3: #b39ddb; --color-4: #d1c4e9; --color-5: #673ab7; --color-6: #9c27b0; --color-7: #ffffff; --color-8: #1a1b1f; --color-9: #7b1fa2; --color-10: #ff4081; --color-11: #b39ddb; --color-12: #d32f2f; --color-13: #757575;--color-pending: #717d7e;--color-preparation: #68a4d1;--color-delivered: #1e4f7f;--color-paid: #008f39;';
        break;
      case '4':
        cssProperties =
          '--color-1:#555;--color-2:#777;--color-3:#999;--color-4:#bbb;--color-5:#888;--color-6:#f2f2f2;--color-7:#fff;--color-8:#333;--color-9:#008f39;--color-10:#cc0000;--color-11:#999;--color-12:#d53032;--color-13:#717d7e;--color-pending: #717d7e;--color-preparation: #68a4d1;--color-delivered: #1e4f7f;--color-paid: #008f39;';
        break;
      default:
        cssProperties = '';
    }
    const loading = await this.loadingService.loading();
    await loading.present();
    this.themeService
      .putTheme(1, cssProperties)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(theme => {
        this.applyStyles(theme.cssProperties);
        this.toastrService.success('Tema cambiando exitosamente');
        loading.dismiss();
        this.router.navigate(['/themes']);
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

  setupSlider() {
    let slider = document.querySelector('.slider .list') as HTMLElement;
    let items = document.querySelectorAll(
      '.slider .list .item'
    ) as NodeListOf<HTMLElement>;
    let next = document.getElementById('next');
    let prev = document.getElementById('prev');
    let dots = document.querySelectorAll('.slider .dots li');

    let lengthItems = items.length - 1;
    let active = 0;

    if (slider) {
      next?.addEventListener('click', () => {
        active = active + 1 <= lengthItems ? active + 1 : 0;
        reloadSlider();
      });

      prev?.addEventListener('click', () => {
        active = active - 1 >= 0 ? active - 1 : lengthItems;
        reloadSlider();
      });

      let refreshInterval = setInterval(() => {
        next?.click();
      }, 3000);

      function reloadSlider() {
        slider!.style.left = -items[active].offsetLeft + 'px';
        let last_active_dot = document.querySelector('.slider .dots li.active');
        last_active_dot?.classList.remove('active');
        dots[active].classList.add('active');

        clearInterval(refreshInterval);
        refreshInterval = setInterval(() => {
          next?.click();
        }, 3000);
      }

      dots.forEach((li, key) => {
        li.addEventListener('click', () => {
          active = key;
          reloadSlider();
        });
      });

      window.onresize = function (event) {
        reloadSlider();
      };
    }
  }
}
