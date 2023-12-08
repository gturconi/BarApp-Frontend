import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carta',
  templateUrl: './carta.component.html',
  styleUrls: ['./carta.component.scss'],
})
export class CartaComponent  implements OnInit {

 constructor() { }

 tituloHeader = "Categorías de la carta";
  
  categories = [
    {
      id: '1',
      titulo: 'Mariscos',
      url: "https://hips.hearstapps.com/hmg-prod/images/plato-de-mariscos-1595505096.jpg?crop=1xw:0.8048076923076923xh;center,top&resize=1200:*"
    },
    {
      id: '2',
      titulo: 'Salchichas',
      url: "https://carrefourar.vtexassets.com/arquivos/ids/312553/7790079010828_E02.jpg?v=638163425812270000"
    },
    {
      id: '2',
      titulo: 'Salchichas',
      url: "https://carrefourar.vtexassets.com/arquivos/ids/312553/7790079010828_E02.jpg?v=638163425812270000"
    },
    {
      id: '2',
      titulo: 'Salchichas',
      url: "https://carrefourar.vtexassets.com/arquivos/ids/312553/7790079010828_E02.jpg?v=638163425812270000"
    },
    {
      id: '2',
      titulo: 'Salchichas',
      url: "https://carrefourar.vtexassets.com/arquivos/ids/312553/7790079010828_E02.jpg?v=638163425812270000"
    },
    {
      id: '2',
      titulo: 'Salchichas',
      url: "https://carrefourar.vtexassets.com/arquivos/ids/312553/7790079010828_E02.jpg?v=638163425812270000"
    }
  ]
  
  ngOnInit() {
    console.log(this.categories)
  }
}
