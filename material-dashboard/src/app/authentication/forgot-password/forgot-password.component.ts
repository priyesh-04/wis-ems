import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { validatorEmail } from "../../utils/custom-validators";
import { AuthService } from "../../services/auth/auth.service";
import { MesgageService } from '../../services/shared/message.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public forgotPass : FormGroup

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private _mesgageService: MesgageService
  ) {}

  ngOnInit(): void {
    this.forgotPass = this.fb.group({
      email_id: ["", [Validators.required, validatorEmail]],
    });
  }

  public get fpass() {
    return this.forgotPass.controls;
  }

  public forgotPassword() {
    const forgotPass = this.forgotPass.value;
    this._authService.forgotPassword(forgotPass).subscribe(
      (data) => {
        this._mesgageService.showSuccess(data.message);
      },
      (err) => {
        this._mesgageService.showError(err.error.message || "Something went wrong");
      }
    );
  }
}
