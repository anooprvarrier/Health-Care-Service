import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { Patient } from "../../models/patient";
import { DataService } from "../../services/data.service";
import * as alertify from "alertify.js";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.css"],
  providers: [DatePipe],
})
export class FormComponent implements OnInit {
  public complexForm: FormGroup;
  public patientDetails = new Patient();
  public today: string;
  public result;

  public noRecordsFound =
    "No patient records found in the list. Click on Register New Patient to add Patient details.";
  public emptyFirstname = "You must include a first name.";
  public minlengthFirstname =
    "Your first name must be at least 3 characters long.";
  public maxlengthFirstname = "Your first name cannot exceed 20 characters.";
  public emptyLastname = "You must include a last name.";
  public minlengthLastname =
    "Your last name must be at least 3 characters long.";
  public maxlengthLastname = "Your last name cannot exceed 20 characters.";
  public noGender = "You must select a gender.";
  public noDob = "You must select a valid date of birth.";
  public noMobile = "You must include mobile number.";
  public numberMobile = "You must enter a valid 10 digit mobile number.";
  public maxlengthMobile = "Your mobile number should not exceed 10 digits.";
  public noEmail = "You must include a valid email.";
  public patternEmail = "Pattern does not match.";

  public ngOnInit(): void {
    this.today = this.datePipe.transform(Date.now(), "yyyy-MM-dd");
  }

  public constructor(
    fb: FormBuilder,
    private datePipe: DatePipe,
    private route: Router,
    private dataService: DataService
  ) {
    // add necessary validators

    this.complexForm = fb.group({
      firstName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      lastName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      gender: [null, Validators.required],
      dob: [null, Validators.required],
      mobile: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(/^\d{10,}$/),
        ],
      ],
      email: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        ],
      ],
      description: "",
    });
  }

  public submitForm(value: any): void {
    // assign new date object to reportedTime
    // should reister new patient using service
    // if added successfully should redirect to 'patientList' page
    this.patientDetails = {
      firstName: this.complexForm.controls.firstName.value,
      lastName: this.complexForm.controls.lastName.value,
      dob: this.complexForm.controls.dob.value,
      description: this.complexForm.controls.description.value,
      email: this.complexForm.controls.email.value,
      mobile: this.complexForm.controls.email.value,
      gender: this.complexForm.controls.gender.value,
      registeredTime: new Date(),
    };
    this.dataService.registerPatient(this.patientDetails).subscribe(
      (res) => {
        if (res) {
          this.route.navigate(["/patientList"]);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
