import { Injectable } from "@angular/core";
import { ToastOptions } from "@ionic/angular";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  constructor(private toastrService: ToastrService) {}

  async presentToast(opts?: ToastOptions) {
    let errorMessage = "";
    if (typeof opts?.message === "string") {
      this.toastrService.error(opts?.message);
    } else if (typeof opts?.message === "object") {
      const keys = Object.keys(opts?.message) as Array<
        keyof typeof opts.message
      >;
      for (let i = 0; i < keys.length; i++) {
        errorMessage += String(opts?.message[keys[i]]);

        if (i < keys.length - 1) {
          errorMessage += "<br><br>";
        }
      }
      this.toastrService.error(errorMessage);
    }
  }
}
