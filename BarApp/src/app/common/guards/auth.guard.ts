import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";

import { LoginService } from "@common/services/login.service";

export const authGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const isLoggedIn = loginService.isLoggedIn();

  if (!isLoggedIn) {
    router.navigate(["auth"]);
  }

  return isLoggedIn;
};
