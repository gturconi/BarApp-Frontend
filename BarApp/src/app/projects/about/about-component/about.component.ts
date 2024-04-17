import { Component, OnInit } from "@angular/core";
import { Contact } from "@common/models/about";
import { AboutService } from "../services/about.service";
import { Router } from "@angular/router";
import { RoleService } from "../../users/services/role.service";
import { LoginService } from "@common/services/login.service";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
  providers: [AboutService],
})

export class AboutComponent implements OnInit {
  data: Contact[] = [];
  isLoading: boolean = false;
  isAdmin: boolean = false;
  
  constructor(private aboutService: AboutService,
    private loginService: LoginService,
    public router: Router) {}

  ngOnInit() {
    this.isLoading = true;
    this.aboutService.getContact().subscribe((response) => {
      this.data = response.results;
      this.isLoading = false;
    })
    this.isAdmin = this.loginService.isAdmin();
  }

  redirectToEditForm(data: Contact) {
    window.localStorage.setItem("temporary_contact", JSON.stringify(data));
    this.router.navigate(['about/edit/']);
  }

}
