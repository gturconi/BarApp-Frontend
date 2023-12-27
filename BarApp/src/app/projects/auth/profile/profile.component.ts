import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

import { LoginService } from "@common/services/login.service";
import { UserService } from "../../services/user.service";
import { ImageService } from "@common/services/image.service";
import { ToastrService } from "ngx-toastr";

import { User } from "@common/models/user";
import { Avatar } from "@common/models/avatar";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  public user: User | null = null;
  imageUrl$: Observable<string> | null = null;

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private imageService: ImageService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    let userStr = localStorage.getItem("user");
    this.user = JSON.parse(userStr!);
    if (this.user && this.user.avatar && "data" in this.user.avatar) {
      const avatar = this.user.avatar as Avatar;
      this.imageUrl$ = this.imageService.getImage(avatar.data, avatar.type);
    }
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(["/auth"]);
  }

  editProfile() {
    this.router.navigate(["/auth/profile/edit/" + this.user?.id]);
  }

  async takeImage() {
    const imageUrl = (await this.imageService.takePicture("Avatar del usuario"))
      .dataUrl;
    if (imageUrl) {
      const newAvatar = this.imageService.convertBase64ToAvatar(imageUrl);
      this.user!.avatar = newAvatar;

      const formData = new FormData();
      formData.append(
        "avatar",
        new Blob([new Uint8Array(newAvatar.data)], {
          type: `image/${newAvatar.type}`,
        })
      );

      this.userService.updateAvatar(this.user!.id, formData).subscribe(user => {
        this.toastrService.success("Avatar actualizado");
        this.loginService.setUser(user);
        this.updateImageUrl();
      });
    }
  }

  private updateImageUrl() {
    if (this.user && this.user.avatar && "data" in this.user.avatar) {
      const avatar = this.user.avatar as Avatar;
      this.imageUrl$ = this.imageService.getImage(avatar.data, avatar.type);
    }
  }
}
