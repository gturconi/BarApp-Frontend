import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpStatusCode,
  HttpErrorResponse,
  HttpResponse,
} from "@angular/common/http";
import { Router } from "@angular/router";

import { Observable, catchError, of, tap } from "rxjs";
import { NotificationService } from "@common/services/notification.service";

@Injectable({
  providedIn: "root",
})
export class ErrorInterceptor {
  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(request).pipe(
      tap(event => {
        //  console.log(event);
        if (event instanceof HttpErrorResponse) {
          //  console.log("HTTP Response:", event.error.message);
          this.notificationService.presentToast({
            message: event.error.message,
            duration: 2500,
            color: "ion-color-danger",
            position: "middle",
            icon: "alert-circle-outline",
          });
        }
      })
    );
  }
}
