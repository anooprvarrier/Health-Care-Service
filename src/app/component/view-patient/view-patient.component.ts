import { Component, OnInit } from "@angular/core";
import { DataService } from "../../services/data.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import "rxjs/add/operator/switchMap";
import { DatePipe } from "@angular/common";
import { Appointment } from "../../models/appointment";
import * as alertify from "alertify.js";

@Component({
  selector: "app-view-patient",
  templateUrl: "./view-patient.component.html",
  styleUrls: ["./view-patient.component.css"],
  providers: [DatePipe],
})
export class ViewPatientComponent implements OnInit {
  public patient;
  public names;
  public today;
  public isBookAppointment: boolean = true;
  public isFormEnabled: boolean = false;
  public isScheduledAppointment: boolean = true;
  public isTableEnabled: boolean = false;
  public appointmentForm: FormGroup;
  public appointmentDetails = new Appointment();
  public bookedAppointmentResponse;
  public ScheduledAppointmentResponse;
  public scheduledAppointments: Appointment[] = [];

  public constructor(
    fb: FormBuilder,
    private route: Router,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
  ) {
    this.today = this.datePipe.transform(Date.now(), "yyyy-MM-dd");
    // add necessary validators
    this.appointmentForm = fb.group({
      selectDisease: [null],
      tentativeDate: [null],
      priority: [null],
    });
  }

  public ngOnInit() {
    // get selected patient id
    // get Particular Patient from service using patient id and assign response to patient property
    this.activatedRoute.params.subscribe((params: { id: string }) => {
      this.dataService
        .getParticularPatient(parseInt(params.id, 10))
        .subscribe((data) => {
          this.patient = data;
        });
    });
  }

  public bookAppointment() {
    // get diseases list from service
    // change isBookAppointment, isScheduledAppointment, isFormEnabled, isTableEnabled property values appropriately
    this.dataService.getDiseasesList().subscribe((data) => {
      this.names = data;
    });
    this.isBookAppointment = false;
    this.isFormEnabled = true;
    this.isScheduledAppointment = true;
    this.isTableEnabled = false;
  }

  public scheduleAppointment() {
    // The below attributes to be added while booking appointment using service
    // patientId, patientFirstName, patientLastName, disease, priority, tentativedate, registeredTime
    // if booked successfully should redirect to 'requested_appointments' page
    const appointment = {
      patientFirstName: this.patient.firstName,
      patientLastName: this.patient.lastName,
      disease: this.appointmentForm.get("selectDisease").value,
      priority: this.appointmentForm.get("priority").value,
      tentativedate: this.appointmentForm.get("tentativeDate").value,
    };
    this.dataService.bookAppointment(appointment).subscribe(
      (data) => {
        if (data) {
          this.route.navigate(["/requested_appointments"]);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public scheduledAppointment() {
    // change isBookAppointment, isScheduledAppointment, isFormEnabled, isTableEnabled property values appropriately
    // get particular patient appointments using getAppointments method of DataService
    this.isBookAppointment = true;
    this.isScheduledAppointment = false;
    this.isTableEnabled = true;
    this.isFormEnabled = false;
    this.dataService.getAppointments(this.patient.id).subscribe((data) => {
      this.scheduledAppointments = data;
    });
  }

  public cancelAppointment(id) {
    // delete selected appointment uing service
    // After deleting the appointment, get particular patient appointments
    this.dataService.deleteAppointment(id).subscribe((data) => {});
  }
}
