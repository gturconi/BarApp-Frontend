import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modalComponent.html',
})
export class ModalComponent {
  public title = '';
  public items: { key: string; value: string; link: string }[] = [];
  public button: { title: string; fn: any } = { title: '', fn: () => {} };
  public itemsRendered = false;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private router: Router
  ) {}

  ngOnInit() {
    this.title = this.navParams.get('title');
    this.items = this.navParams.get('items');
    this.button = this.navParams.get('button');
    const modal1 = document.getElementsByTagName('ion-modal')[0];
    modal1?.remove();

    setTimeout(() => {
      this.itemsRendered = true;
    }, 1500);
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

  executeFn() {
    this.button.fn();
    this.closeModal();
  }
}
