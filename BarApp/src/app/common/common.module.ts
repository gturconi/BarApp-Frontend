import { NgModule } from "@angular/core";
import { LoginService } from "./services/login.service";
import { LoadingService } from "./services/loading.service";
import { ImageService } from "./services/image.service";
import { NotificationService } from "./services/notification.service";
@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [LoginService, LoadingService, ImageService, NotificationService],
})
export class CommonModule {}
