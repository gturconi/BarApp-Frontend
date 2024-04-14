import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modalComponent.html',
})
export class ModalComponent {
  public title = '';
  public items: { value: string; link: string }[] = [];

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private router: Router
  ) {}

  ngOnInit() {
    this.title = this.navParams.get('title');
    this.items = this.navParams.get('items');
    const modal1 = document.getElementsByTagName('ion-modal')[0];
    modal1?.remove();
  }

  closeModal() {
    this.modalController.dismiss();
  }

  navigate(link: string) {
    if (link) {
      this.modalController.dismiss();
      this.router.navigate([link]);
    }
  }
}
