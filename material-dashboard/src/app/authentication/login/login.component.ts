import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";
import { NgForm, Validators } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { validatorEmail } from "../../utils/custom-validators";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  hide = true;
  loginUserData = {};
  didLogin = false;

  isLoading = false;
  isLoaded = false;

  constructor(
    public _authService: AuthService,
    public _router: Router,
    public _cookieService: CookieService,
    public _route: ActivatedRoute,
    public fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email_id: ["", [Validators.required, validatorEmail]],
      password: ["", [Validators.required]],
    });
  }

  get lForm() {
    return this.loginForm.controls;
  }

  doLogin(loginForm: FormGroup) {
    if (!this.isLoaded) {
      this.isLoading = true;
      this.isLoaded = true;
    }
    this.loginUserData = loginForm.value;
    this._authService.doLogin(this.loginUserData).subscribe(
      (data) => {
        const date = new Date(data.expires);
        this._authService.setCurrentUser(data, date);
        this.didLogin = true;
        this._authService.userLoggedIn = this._cookieService.get("currentUser");
        const returnUrl = this._route.snapshot.queryParamMap.get("returnUrl");
        console.log("login success", data);
        this._router.navigate([returnUrl || "/"]);
        if (this.isLoaded) {
          this.isLoading = false;
          this.isLoaded = false;
        }
      },
      (err) => {
        alert(err.error.detail);
        if (this.isLoaded) {
          this.isLoading = false;
          this.isLoaded = false;
        }
        console.log(err);
      }
    );
  }
}
