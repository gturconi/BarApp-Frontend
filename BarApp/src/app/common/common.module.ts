import { NgModule } from "@angular/core";
import { LoginService } from "./services/login.service";
import { LoadingService } from "./services/loading.service";
import { NotificationService } from "./services/notification.service";
import { AuthGoogleService } from "./services/auth-google.service";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    LoginService,
    LoadingService,
    NotificationService,
    AuthGoogleService,
  ],
})
export class CommonModule {}
