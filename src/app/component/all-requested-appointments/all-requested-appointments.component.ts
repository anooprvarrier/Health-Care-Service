import { Component, OnInit } from "@angular/core";
import { DataService } from "../../services/data.service";
import { Router } from "@angular/router";
import * as alertify from "alertify.js";

@Component({
  selector: "app-all-requested-appointments",
  templateUrl: "./all-requested-appointments.component.html",
  styleUrls: ["./all-requested-appointments.component.css"],
})
export class AllRequestedAppointmentsComponent implements OnInit {
  public allAppointments;

  public constructor(private dataService: DataService, private route: Router) {}

  public ngOnInit(): void {
    // call appointments method by default
    this.appointments();
  }

  public appointments(): void {
    // get all requested appointments from service
    this.dataService.requestedAppointments().subscribe(
      (data) => {
        this.allAppointments = data;
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

  public cancelAppointment(id): void {
    // delete selected appointment uing service
    // After deleting the appointment, get all requested appointments
    this.dataService.deleteAppointment(id).subscribe((data) => {
      console.log(data);
      this.appointments();
    });
  }
}
