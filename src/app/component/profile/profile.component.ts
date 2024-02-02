import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { Users } from "../../models/users.model";
import { DataService } from "../../services/data.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  // used as a flag to display or hide form
  public editProfile = false;
  public userId = -1;
  public userDetails = new Users();

  public editProfileForm: FormGroup;

  public userImg = "./../../assets/user.jpg";
  public mobileErrMsg = "You must enter a valid mobile number";
  public emailErrMsg = "You must enter a valid Email ID";
  public locationErrMsg = "You must enter the location";

  public constructor(private dataService: DataService) {}

  public ngOnInit(): void {
    // add necessary validators
    // username should be disabled. it should not be edited

    this.editProfileForm = new FormGroup({
      userName: new FormControl({ value: "", disabled: true }, [
        Validators.required,
      ]),
      mobile: new FormControl("", [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      email: new FormControl("", [Validators.required, Validators.email]),
      location: new FormControl("", [Validators.required]),
    });

    // get login status from service
    // get userId from service and assign it to userId property
    // get profile details and display it
    this.userId = this.dataService.getUserId();
    this.getProfileDetails();
  }

  public changeMyProfile(): void {
    // if successfully changed the profile it should display new details hiding the form
    const userDetails: Users = {
      email: this.editProfileForm.controls.email.value,
      username: this.editProfileForm.controls.userName.value,
      mobile: this.editProfileForm.controls.mobile.value,
      location: this.editProfileForm.controls.location.value,
      userId: this.userDetails.userId,
    };
    this.dataService.updateProfile(userDetails).subscribe(this.updateSuccess);
  }

  private updateSuccess = (success: boolean): void => {
    if (success) {
      this.getProfileDetails();
      this.discardEdit();
    }
  };

  public editMyProfile(): void {
    // change editProfile property value appropriately

    this.editProfileForm.controls.userName.setValue(this.userDetails.username);
    this.editProfileForm.controls.mobile.setValue(this.userDetails.mobile);
    this.editProfileForm.controls.email.setValue(this.userDetails.email);
    this.editProfileForm.controls.location.setValue(this.userDetails.location);
    this.editProfile = true;
  }

  public discardEdit(): void {
    // change editProfile property value appropriately
    this.editProfile = false;
  }

  getProfileDetails() {
    // retrieve user details from service using userId
    this.dataService.getUserDetails(this.userId).subscribe(
      (details) => {
        this.userDetails = details;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
