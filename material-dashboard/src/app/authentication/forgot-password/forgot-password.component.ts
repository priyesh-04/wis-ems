import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { validatorEmail } from "../../utils/custom-validators";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPass : FormGroup
  constructor(public fb: FormBuilder,
    public _authService: AuthService,
    public _router: Router,
    public _cookieService: CookieService,
    public _route: ActivatedRoute) { }

  ngOnInit(): void {
    this.forgotPass = this.fb.group({
      email_id: ["", [Validators.required, validatorEmail]],
    });
  }

/**
 * forgotPass
 */
public forgotPassword(forgotPass:FormGroup) {
  
  // this.forgotPass = forgotPass.value;
  // console.log(this.forgotPass);
    this._authService.forgotPassword(this.forgotPass).subscribe(
      (data) => {
        
        console.log("login success", data);
        
      },
      (err) => {        
        setTimeout(() => {
          // show error Msg 
        }, 3000);
        console.log(err);
      }
    );
}

}
