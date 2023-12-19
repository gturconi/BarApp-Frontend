import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { EntityListResponse } from '@common/models/entity.list.response';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductType } from '@common/models/productType';
import { ProductsTypeService } from 'src/app/projects/services/producsType-service/products-type.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [ProductsTypeService],
})
export class MenuComponent implements OnInit {
  showBackButton: boolean = false;

  menuItems: any[] = [
    { icon: 'person-outline', label: 'Iniciar Sesión', section: 'upper' },
    { icon: 'calendar-outline', label: 'Reserva', section: 'upper' },

    { icon: 'mail-outline', label: 'Contacto', section: 'lower' },
    { icon: 'help-outline', label: 'Preguntas Frecuentes', section: 'lower' },
  ];

  accordionData: {
    label: string;
    icon: string;
    subItems: { label: string }[];
    expanded: boolean;
  }[] = [
    {
      label: 'Carta',
      icon: 'fast-food-outline',
      subItems: [],
      expanded: false,
    },
  ];

  pageSize: number = 10;
  pageIndex: number = 1;

  productsTypeList$ = new Subject<EntityListResponse<ProductType>>();

  constructor(
    public producTypeService: ProductsTypeService,
    public router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showBackButton = !(
          event.url === '/home' || event.url === '/intro'
        );
      }
    });
  }

  ngOnInit() {
    this.getProductsType();
  }

  getProductsType(search?: string): void {
    this.producTypeService
      .getProductsType(this.pageIndex, this.pageSize, search)
      .pipe(
        map((response: any) => {
          const products: { label: string }[] = response.results.map(
            (producto: ProductType) => {
              return {
                label: producto.description,
              };
            }
          );
          return products;
        })
      )
      .subscribe(transformedData => {
        this.accordionData[0].subItems = transformedData;
      });
  }

  /*para poder poner los items arriba o abajo del acordeon*/
  getUpperMenuItems() {
    return this.menuItems.filter(item => item.section === 'upper');
  }

  getLowerMenuItems() {
    return this.menuItems.filter(item => item.section === 'lower');
  }

  goBack(): void {
    window.history.back();
  }
}
