import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  implements OnInit {

  isMobile: boolean = false; 

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkIfMobile();
  }

  ngOnInit() {
    this.checkIfMobile();
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }
}

