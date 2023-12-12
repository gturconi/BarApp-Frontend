import { Injectable } from "@angular/core";
import { AuthConfig, OAuthService } from "angular-oauth2-oidc";

@Injectable({
  providedIn: "root",
})
export class AuthGoogleService {
  constructor(private oauthService: OAuthService) {}

  initLogin() {
    const config: AuthConfig = {
      issuer: "https://accounts.google.com",
      strictDiscoveryDocumentValidation: false,
      clientId: "",
      redirectUri: window.location.origin + "/home",
      scope: "openid profile email phone",
    };
  }
}
