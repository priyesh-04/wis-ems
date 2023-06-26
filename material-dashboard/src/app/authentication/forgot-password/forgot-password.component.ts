import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { validatorEmail } from "../../utils/custom-validators";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPass : FormGroup
  constructor(public fb: FormBuilder) { }

  ngOnInit(): void {
    this.forgotPass = this.fb.group({
      email_id: ["", [Validators.required, validatorEmail]],
    });
  }

  get lForm() {
    return this.forgotPass.controls;
  }
/**
 * forgotPass
 */
public forgotPassword(forgotPass:FormGroup) {
  
}

}
