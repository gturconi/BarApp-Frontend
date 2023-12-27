import {
  HttpRequest,
  HttpHandler,
  HttpHeaders,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, of } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private toastrService: ToastrService) {}

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
        this.toastrService.error(exception.error.message);
        return of(exception);
      })
    );
  }
}
