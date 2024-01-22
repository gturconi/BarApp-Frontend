import {
  HttpRequest,
  HttpHandler,
  HttpHeaders,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

import { NotificationService } from '@common/services/notification.service';
import { Router } from '@angular/router';
import { LoginService } from '@common/services/login.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private loginService: LoginService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let token = localStorage.getItem('token');
    let error = { message: '' };

    const isFileUpload = req.body instanceof FormData;

    const headers = isFileUpload
      ? new HttpHeaders({
          'x-access-token': token || '',
        })
      : new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token || '',
        });

    const reqClone = req.clone({
      headers,
    });

    return next.handle(reqClone).pipe(
      catchError(exception => {
        exception.status
          ? (error.message = exception.error.message)
          : //this.router.navigate(["/auth"]),
            //this.loginService.logout())
            (error.message = 'No se pudo completar la solicitud');
        this.notificationService.presentToast(error);
        return of(exception);
      })
    );
  }
}
