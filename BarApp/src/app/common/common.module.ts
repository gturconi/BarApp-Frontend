import { NgModule } from '@angular/core';
import { LoginService } from './services/login.service';
import { LoadingService } from './services/loading.service';
import { ImageService } from './services/image.service';
import { NotificationService } from './services/notification.service';
import { CartService } from './services/cart.service';
import { BadgeService } from './services/badge.service';
import { SocketService } from './services/socket.service';
@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    LoginService,
    LoadingService,
    ImageService,
    NotificationService,
    CartService,
    BadgeService,
    SocketService,
  ],
})
export class CommonModule {}
