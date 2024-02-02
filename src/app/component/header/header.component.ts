import { Component, OnInit, DoCheck, Inject } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { DataService } from "../../services/data.service";
import { Users } from "../../models/users.model";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  public userId = -1;
  public userDetails = new Users();

  public constructor(private dataService: DataService) {}

  public ngOnInit(): void {
    // get userId from service and assign it to userId property
    // call getProfileDetails method to get user details
    this.userId = this.dataService.getUserId();
    this.getProfileDetails();
  }

  public getProfileDetails(): void {
    // call getUserDetails method of dataService and assign
    // response to userDetails property
    this.dataService.getUserDetails(this.userId).subscribe(
      (data) => {
        this.userDetails = data;
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
