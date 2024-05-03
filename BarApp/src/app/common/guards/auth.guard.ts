import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { LoginService } from '@common/services/login.service';
import { NotificationService } from '@common/services/notification.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const toastrService = inject(ToastrService);
  const router = inject(Router);
  const isLoggedIn = loginService.isLoggedIn();

  if (!isLoggedIn) {
    toastrService.error('Por favor inicie sesion');
    router.navigate(['auth']);
  }

  return isLoggedIn;
};
