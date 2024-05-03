import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { LoginService } from '@common/services/login.service';
import { UserRoles } from '@common/constants/user.roles.enum';

export const adminEmployeeGuard: CanActivateFn = (route, state) => {
  return true;
  const loginService = inject(LoginService);
  const router = inject(Router);

  let role = loginService.getUserRole();

  if (!(role === UserRoles.Admin || role === UserRoles.Employee)) {
    router.navigate(['auth']);
  }

  return true;
};
