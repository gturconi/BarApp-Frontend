import { NgModule } from "@angular/core";
import { LoginService } from "./services/login.service";
import { LoadingService } from "./services/loading.service";
import { NotificationService } from "./services/notification.service";
import { ImageService } from "./services/image.service";
@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [LoginService, LoadingService, NotificationService, ImageService],
})
export class CommonModule {}
