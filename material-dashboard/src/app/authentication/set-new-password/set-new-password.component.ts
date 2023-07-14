import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { AuthService } from "../../services/auth/auth.service";
import { MesgageService } from '../../services/shared/message.service';
import { PasswordStrengthValidator } from '../utils/password.validators';
@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.css']
})
export class SetNewPasswordComponent implements OnInit {
  private userId :string;
  private token : string;
  public resetPass: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private _mesgageService: MesgageService,
    private _router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.resetPass = this.fb.group({
      password: ["", [Validators.required, PasswordStrengthValidator]],
      conPassword: ["", [Validators.required]],
    },{ 
      validators: this.password.bind(this)
    })   
    
    let params = this.activatedRoute.snapshot.params;
      this.userId = params['userId'];
      this.token = params['token'];
  }
  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: conPassword } = formGroup.get('conPassword');
    return password === conPassword ? null : { passwordNotMatch: true };
  }
  public get lForm() {
    return this.resetPass.controls;
  }
  
  public resetPassword() {    
    if (this.resetPass.value.password !== this.resetPass.value.conPassword) {
        this._mesgageService.showError('Confirm password not matched');
    } else {
      const editObj = {
        password: this.resetPass.value.password
      }
      
      this._authService.setNewPassword(editObj, this.userId, this.token).subscribe(
        (data) => {
          this._mesgageService.showSuccess(data.message || 'Password changed successfully');
          this._router.navigate(['/login']);
        },
        (err) => {
          this._mesgageService.showError(err.error.message);
        }
      );
    }
  }
}
