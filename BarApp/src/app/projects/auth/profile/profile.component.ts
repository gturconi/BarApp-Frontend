import { Component, OnInit } from "@angular/core";
import { LoginService } from "@common/services/login.service";
import { UserService } from "../../services/user.service";
import { User } from "@common/models/user";
import { ImageService } from "@common/services/image.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

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
    private router: Router
  ) {}

  ngOnInit() {
    let userStr = localStorage.getItem("user");
    this.user = JSON.parse(userStr!);
    if (this.user?.avatar) {
      this.imageUrl$ = this.imageService.getImage(
        this.user?.avatar.data,
        this.user?.avatar.type
      );
    }
  }

  logout() {
    this.loginService.logout();
  }

  editProfile() {
    this.router.navigate(["/auth/profile/edit/" + this.user?.id]);
  }
}
