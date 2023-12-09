import { Injectable } from "@angular/core";
import { ToastController, ToastOptions } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  constructor(private toastCtrl: ToastController) {}

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }
}
