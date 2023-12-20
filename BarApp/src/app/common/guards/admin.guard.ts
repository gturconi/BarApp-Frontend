import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";

import { LoginService } from "@common/services/login.service";
import { UserRoles } from "@common/constants/user.roles.enum";

export const adminGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  let role = loginService.getUserRole();

  if (!(role === UserRoles.Admin)) {
    router.navigate(["auth"]);
  }

  return true;
};
