import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { validatorEmail } from "../../utils/custom-validators";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";
import { CookieService } from "ngx-cookie-service";
import { MesgageService } from '../../services/shared/message.service';
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
    public _route: ActivatedRoute,
    private _mesgageService: MesgageService
    ) { }

  ngOnInit(): void {
    this.forgotPass = this.fb.group({
      email_id: ["", [Validators.required, validatorEmail]],
    });
  }

/**
 * forgotPass
 */
public forgotPassword(forgotPass:FormGroup) {
  
  this.forgotPass = forgotPass.value;
  // console.log(this.forgotPass);
    this._authService.forgotPassword(this.forgotPass).subscribe(
      (data) => {
        this._mesgageService.showSuccess(data.message);
      },
      (err) => {        
        this._mesgageService.showError(err.message);
      }
    );
}

}
