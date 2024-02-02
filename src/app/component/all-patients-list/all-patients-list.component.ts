import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DataService } from "../../services/data.service";

@Component({
  selector: "app-all-patients-list",
  templateUrl: "./all-patients-list.component.html",
  styleUrls: ["./all-patients-list.component.css"],
})
export class AllPatientsListComponent implements OnInit {
  public allPatients;

  public constructor(private route: Router, private dataService: DataService) {}

  public ngOnInit(): void {
    // get all patients list from service
    this.getAllPatientsList();
  }

  public getAllPatientsList(): void {
    this.dataService.getAllPatientsList().subscribe(
      (data) => {
        this.allPatients = data;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public view(patientId): void {
    // should navigate to 'patientList' page with selected patientId
    this.route.navigate(["patientList", patientId]);
  }
}
