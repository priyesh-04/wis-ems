import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private baseUrl = environment.base_api_url;
  public userLoggedIn = this._cookieService.get("currentUser");

  constructor(
    private http: HttpClient,
    private _cookieService: CookieService
  ) {}

  private createHeaders(token?: string) {
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

  public setCurrentUser(user: any, expires?: Date, msg?: string) {
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

  public checkToken() {    
    return this._cookieService.check("token");
  }

  public getAuthorizationToken() {
    return this._cookieService.get("token");
  }

  public getLoggedInUser() {
    return this._cookieService.get("currentUser");
  }

  public isAdmin() {
    const UserRole = this._cookieService.get("role");
    if (UserRole === "admin") {
      return "true";
    }
    return "false";
  }

  public isStaff() {
    const userRole = this._cookieService.get("role");
    if (userRole === "hr") {
      return "true";
    }
    return "false";
  }

  public performLogout(userId): Observable<any> {
    const endpoint = `${this.baseUrl}/logout/${userId}`;
    const httpOptions = this.createHeaders();
    this._cookieService.delete("token");
    this._cookieService.delete("refreshToken");
    this._cookieService.delete("currentUser");
    this._cookieService.delete("role");
    this._cookieService.delete("id");
    return this.http.post(endpoint, httpOptions);    
  }

  public doLogin(userData): Observable<any> {
    const endpoint = `${this.baseUrl}/login/`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, userData, httpOptions);
  }

  public getProfile(): Observable<any> {
    const endpoint = `${this.baseUrl}/my-profile`;
    const httpOptions = this.createHeaders();
    return this.http.get(endpoint, httpOptions);
  }

  public changePassword(userData: any): Observable<any> {
    const endpoint = `${this.baseUrl}/reset-password`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, userData, httpOptions);
  }

  public forgotPassword(userData: any): Observable<any> {
    const endpoint = `${this.baseUrl}/forgot-password-email-send`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, userData, httpOptions);
  }

  public setNewPassword(userData: any, userId:string, token:string): Observable<any> {
    const endpoint = `${this.baseUrl}/change-password/${userId}/${token}`;
    const httpOptions = this.createHeaders();
    return this.http.post(endpoint, userData, httpOptions);
  }

  public getUserDetail() {
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
