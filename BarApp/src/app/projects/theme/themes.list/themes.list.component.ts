import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-themes.list',
  templateUrl: './themes.list.component.html',
  styleUrls: ['./themes.list.component.scss'],
})
export class ThemesListComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {}

  tarjetas = [
    {
      imagen: '../../../../assets/img/themes/theme1/theme1.png',
      titulo: 'Terroso',
      id: 1,
    },
    {
      imagen: '../../../../assets/img/themes/theme2/theme2.png',
      titulo: 'Mar y Cielo',
      id: 2,
    },
    {
      imagen: '../../../../assets/img/themes/theme3/theme3.png',
      titulo: 'Lavanda',
      id: 3,
    },
    {
      imagen: '../../../../assets/img/themes/theme4/theme4.png',
      titulo: 'Grisáceo',
      id: 4,
    },
  ];

  redirectToDetails(id: number) {
    const tarjeta = this.tarjetas.find(t => t.id === id);
    if (tarjeta) {
      this.router.navigate(['details', id], {
        relativeTo: this.route.parent,
        queryParams: { titulo: tarjeta.titulo },
      });
    }
  }

  /*
  cssVariables = [
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

  changeCSSVariables() {
    const root = document.documentElement;

    // Aplicar los cambios a las variables CSS
    this.cssVariables.forEach(variable => {
      root.style.setProperty(variable.name, variable.value);
    });
  }
*/
}
