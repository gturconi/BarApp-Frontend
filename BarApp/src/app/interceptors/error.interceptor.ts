import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from "@angular/common/http";

import { tap } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class ErrorInterceptor {
  constructor(private toastrService: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(request).pipe(
      tap(event => {
        //  console.log(event);
        if (event instanceof HttpErrorResponse) {
          //console.log("HTTP Response:", event.error.message);
          this.toastrService.error(event.error.message);
        }
      })
    );
  }
}
