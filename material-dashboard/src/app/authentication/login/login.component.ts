import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";

import { validatorEmail } from "../../utils/custom-validators";
import { AuthService } from "../../services/auth/auth.service";
import { MesgageService } from "../../services/shared/message.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public isLoading = false;
  public passwordType: string = 'password';
  public isPassword: boolean = true;

  constructor(
    private _mesgageService: MesgageService,
    private _authService: AuthService,
    private _cookieService: CookieService,
    private _route: ActivatedRoute,
    private _router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email_id: ["", [Validators.required, validatorEmail]],
      password: ["", [Validators.required]],
    });
  }

  public get form() {
    return this.loginForm.controls;
  }

  public doLogin(loginForm: FormGroup) {
    this.isLoading = !this.isLoading;
    const loginUserData = loginForm.value;
    this._authService.doLogin(loginUserData).subscribe(
      (data) => {
        const date = new Date(data.expires);
        this._authService.setCurrentUser(data, date);
        this._authService.userLoggedIn = this._cookieService.get("currentUser");
        this.isLoading = !this.isLoading;
        this._router.navigate(["/dashboard"]);
      },
      (err) => {
        this.isLoading = !this.isLoading;    
        this._mesgageService.showError(err.error.message || "Login failed");
      }
    );
  }

  public visibilityOnOff() {
      this.isPassword = !this.isPassword;
      if(this.isPassword)
      this.passwordType = "password";
      else 
      this.passwordType = "text";

  }
}
