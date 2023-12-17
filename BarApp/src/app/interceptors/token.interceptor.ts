import {
  HttpRequest,
  HttpHandler,
  HttpHeaders,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, of } from "rxjs";
import { NotificationService } from "@common/services/notification.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let token = localStorage.getItem("token");

    const isFileUpload = req.body instanceof FormData;

    const headers = isFileUpload
      ? new HttpHeaders({
          "x-access-token": token || "",
        })
      : new HttpHeaders({
          "Content-Type": "application/json",
          "x-access-token": token || "",
        });

    const reqClone = req.clone({
      headers,
    });

    return next.handle(reqClone).pipe(
      catchError(exception => {
        this.notificationService.presentToast({
          message: exception.error.message,
          duration: 2500,
          color: "ion-color-danger",
          position: "middle",
          icon: "alert-circle-outline",
        });
        return of(exception);
      })
    );
  }
}
