import { Injectable } from "@angular/core";
import { ToastController, ToastOptions } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  constructor(private toastCtrl: ToastController) {}

  async presentToast(opts?: ToastOptions) {
    let errorMessage = "";
    if (typeof opts?.message === "string") {
      const toast = await this.toastCtrl.create(opts);
      toast.present();
    } else if (typeof opts?.message === "object") {
      const keys = Object.keys(opts?.message) as Array<
        keyof typeof opts.message
      >;
      for (const key of keys) {
        errorMessage += String(opts?.message[key]) + "\n";
      }
      const toast = await this.toastCtrl.create({
        ...opts,
        message: errorMessage,
      });
      toast.present();
    }
  }
}
