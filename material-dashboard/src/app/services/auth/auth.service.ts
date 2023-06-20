import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public userLoggedIn = this._cookieService.get("currentUser");
  baseUrl = environment.base_api_url;

  constructor(
    private http: HttpClient,
    private _cookieService: CookieService,
    private _router: Router
  ) {}

  createHeaders(token?: string) {
    const data = {
      "Content-Type": "application/json",
    };
    if (token) {
      data["Authorization"] = `JWT ${token}`;
    }
    const httpOptions = {
      headers: new HttpHeaders(data),
    };
    return httpOptions;
  }

  setCurrentUser(user: any, expires?: Date, msg?: string) {
    // console.log(user,'user');

    if (user && user.accessToken) {
      let expiryDate = null;
      if (expires) {
        expiryDate = expires;
      }
      this._cookieService.set("token", user.accessToken, expiryDate, "/");
      this._cookieService.set("refreshToken", user.refreshToken, expiryDate, "/");
      this._cookieService.set("currentUser", user.name, expiryDate, "/");
      this._cookieService.set("role", user.role, expiryDate, "/");
      this._cookieService.set("id", user._id, expiryDate, "/");
    }
  }

  checkToken() {
    return this._cookieService.check("token");
  }

  getAuthorizationToken() {
    return this._cookieService.get("token");
  }

  getLoggedInUser() {
    return this._cookieService.get("currentUser");
  }

  isAdmin() {
    const UserRole = this._cookieService.get("role");
    if (UserRole === "admin") {
      return "true";
    }
    return "false";
  }

  isStaff() {
    const userRole = this._cookieService.get("role");
    if (userRole === "hr") {
      return "true";
    }
    return "false";
  }

  performLogout() {
    this._cookieService.delete("token", "/");
    this._router.navigate(["/login"]);
  }

  doLogin(userData): Observable<any> {
    const endpoint = `${this.baseUrl}/login/`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, userData, httpOptions);
  }

  changePassword(userData: any): Observable<any> {
    const endpoint = `${this.baseUrl}/auth/user/password/change/`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, userData, httpOptions);
  }

  getUserDetail() {
    const user = {
      name: this._cookieService.get("currentUser"),
      role: this._cookieService.get("role"),
      id: this._cookieService.get("id"),
    };
    if (user.name === "" && user.role === "") {
      return null;
    }
    return user;
  }
}
