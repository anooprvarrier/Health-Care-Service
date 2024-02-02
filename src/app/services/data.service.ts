import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { Users } from "../models/users.model";
import { Patient } from "../models/patient";
import { Appointment } from "../models/appointment";
import { ApiService } from "./api.service";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class DataService {
  public isLoggedIn = false;
  public isLogIn: BehaviorSubject<boolean>;

  public constructor(private api: ApiService) {
    this.isLogIn = new BehaviorSubject<boolean>(false);
    this.isLogIn.subscribe((val) => {
      this.isLoggedIn = val;
    });
  }

  public authenticateUser(
    username: string,
    password: string
  ): Observable<boolean> {
    return this.api.checkLogin(username, password).pipe(
      map((data) => {
        if (data && data.userId) {
          // store 'userId' from response as key name 'userId' to the localstorage
          localStorage.setItem("userId", data.userId + "");
          // return true if user authenticated
          this.isLogIn.next(true);
          return true;
        } else {
          // return false if user not authenticated
          return false;
        }
      })
    );
  }

  public getAuthStatus(): Observable<boolean> {
    this.isLogIn.next(this.getUserId() > 0 ? true : false);
    return this.isLogIn.asObservable();
  }

  public doLogOut(): boolean {
    // remove the key 'userId' if exists
    this.isLoggedIn = false;
    if (localStorage.getItem("userId")) {
      localStorage.removeItem("userId");
    }
    this.isLogIn.next(false);
    return this.isLoggedIn;
  }

  public getUserDetails(userId: number): Observable<Users> {
    // should return user details retrieved from api service
    return this.api.getUserDetails(userId).pipe(catchError(this.handleError));
  }

  public updateProfile(userDetails): Observable<boolean> {
    // should return the updated status according to the response from api service
    return this.api.updateDetails(userDetails).pipe(
      map((data) => (data ? true : false)),
      catchError(() => {
        return Observable.throw(undefined);
      })
    );
  }

  public registerPatient(patientDetails): Observable<any> {
    // should return response retrieved from ApiService
    // handle error
    return this.api
      .registerPatient(patientDetails)
      .pipe(catchError(this.handleError));
  }

  public getAllPatientsList(): Observable<any> {
    // should return all patients list retrieved from ApiService
    // handle error
    return this.api.getAllPatientsList().pipe(catchError(this.handleError));
  }

  public getParticularPatient(id): Observable<any> {
    // should return particular patient details retrieved from ApiService
    // handle error
    return this.api.getParticularPatient(id).pipe(catchError(this.handleError));
  }

  public getDiseasesList(): Observable<any> {
    // should return response retrieved from ApiService
    // handle error
    return this.api.getDiseasesList().pipe(catchError(this.handleError));
  }

  public bookAppointment(appointmentDetails): Observable<any> {
    // should return response retrieved from ApiService
    // handle error
    return this.api
      .bookAppointment(appointmentDetails)
      .pipe(catchError(this.handleError));
  }

  public getAppointments(patientId): Observable<any> {
    // should return response retrieved from ApiService
    // handle error
    return this.api
      .getAppointments(patientId)
      .pipe(catchError(this.handleError));
  }

  public deleteAppointment(appointmentId): Observable<any> {
    // should return response retrieved from ApiService
    // handle error
    return this.api
      .deleteAppointment(appointmentId)
      .pipe(catchError(this.handleError));
  }

  public requestedAppointments(): Observable<any> {
    // should return response retrieved from ApiService
    // handle error
    return this.api.requestedAppointments().pipe(catchError(this.handleError));
  }

  public getUserId(): number {
    // retrieve 'userId' from localstorage
    const userId = parseInt(localStorage.getItem("userId"), 10);
    if (!this.isLoggedIn) return -1;
    return userId ? userId : -1;
  }

  private handleError(error: any) {
    return Observable.throw(error);
  }
}
