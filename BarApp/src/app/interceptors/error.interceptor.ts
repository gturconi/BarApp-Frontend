import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';

import { tap } from 'rxjs';
import { NotificationService } from '@common/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(request).pipe(
      tap(event => {
        //console.log(event);
        if (event instanceof HttpErrorResponse) {
          this.notificationService.presentToast({
            message: event.error.message,
          });
        }
      })
    );
  }
}
