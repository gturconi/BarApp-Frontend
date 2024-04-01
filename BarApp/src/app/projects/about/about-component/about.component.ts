import { Component, OnInit } from "@angular/core";
import { Contact } from "@common/models/about";
import { AboutService } from "../../services/about.service";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
  providers: [AboutService],
})

export class AboutComponent implements OnInit {
  data: Contact[] = [];
  isLoading: boolean = false;
  constructor(private aboutService: AboutService) {}

  ngOnInit() {
    this.isLoading = true;
    console.log("acacacaca")
    this.aboutService.getContact().subscribe((response) => {
      console.log(response);
      this.data = response.results;
      this.isLoading = false;
    })
  }
}
