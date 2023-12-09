import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  constructor(private loadingCtrl: LoadingController) {}

  loading() {
    return this.loadingCtrl.create({
      spinner: "crescent",
    });
  }
}
