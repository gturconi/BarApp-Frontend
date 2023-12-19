import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  showBackButton: boolean = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd || event instanceof NavigationStart) {
        this.updateBackButtonVisibility(this.router.url);
      }
    });
  }

  ngOnInit() {
    this.updateBackButtonVisibility(this.router.url);
  }

  updateBackButtonVisibility(url: string) {
    this.showBackButton = !['/home', '/intro'].includes(url);
    this.cdr.detectChanges();
  }

  goBack(): void {
    window.history.back();
  }
}
