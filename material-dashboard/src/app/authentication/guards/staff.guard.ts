import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";

import { AuthService } from "../../services/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class StaffGuard implements CanActivate {

  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (
      this._authService.isStaff() !== "false" &&
      this._authService.isAdmin() === "false"
    ) {
      return true;
    }

    this._router.navigate(["/admin/admin-list"]);
    return false;
  }
}
