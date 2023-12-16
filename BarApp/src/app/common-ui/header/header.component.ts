import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

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
