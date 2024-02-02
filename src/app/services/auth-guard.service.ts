import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { DataService } from "./data.service";

@Injectable()
export class AuthGuardService implements CanActivate {
  public constructor(public dataService: DataService, public router: Router) {}
  public canActivate(): boolean {
    // return true if authenticated else redirect to login page
    return this.dataService.isLoggedIn;
  }
}
