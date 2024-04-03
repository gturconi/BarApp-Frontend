import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-themes-details',
  templateUrl: './themes.details.component.html',
  styleUrls: ['./themes.details.component.scss'],
})
export class ThemesDetailsComponent implements OnInit {
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

  constructor(private route: ActivatedRoute) {}

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

  handleChangeTheme() {
    const id = this.route.snapshot.params['id'];
    this.changeCSSVariables(id);
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

  changeCSSVariables(themeId: string) {
    const root = document.documentElement;
    const themeVariables = this.getThemeVariables(themeId);

    themeVariables.forEach(variable => {
      root.style.setProperty(variable.name, variable.value);
    });
  }

  getThemeVariables(themeId: string): { name: string; value: string }[] {
    switch (themeId) {
      case '1':
        return [
          { name: '--color-1', value: '#3a80b8' },
          { name: '--color-2', value: '#2b5797' },
        ];
      case '2':
        return [
          { name: '--color-1', value: '#3a80b8' },
          { name: '--color-2', value: '#2b5797' },
          { name: '--color-3', value: '#a7c8e8' },
          { name: '--color-4', value: '#68a4d1' },
          { name: '--color-5', value: '#1e4f7f' },
          { name: '--color-6', value: '#3d88c7' },
          { name: '--color-7', value: '#ffff' },
          { name: '--color-8', value: '#1a1b1f' },
          { name: '--color-9', value: '#008f39' },
          { name: '--color-10', value: '#cc0000' },
          { name: '--color-11', value: '#a7c8e8' },
          { name: '--color-12', value: '#d53032' },
        ];
      default:
        return [];
    }
  }
}
