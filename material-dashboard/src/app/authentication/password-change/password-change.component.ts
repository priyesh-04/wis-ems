import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth/auth.service';
import { MesgageService } from "../../services/shared/message.service";

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {
  public passwordChangeForm: FormGroup;
  public curPasswordType: string = 'password';
  public newPasswordType: string = 'password';
  public cnfPasswordType: string = 'password';
  public isCurPassword: boolean = true;
  public isNewPassword: boolean = true;
  public isCnfPassword: boolean = true;

  constructor(
    private _authService: AuthService,
    private _mesgageService: MesgageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.passwordChangeForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required,
        Validators.pattern(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g
        ),
        Validators.minLength(8),
      ]],
      confirm_password: ['', [Validators.required,
        Validators.pattern(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g
        ),
        Validators.minLength(8),
      ]]
    });
  }

  public get pcForm() {
    return this.passwordChangeForm.controls;
  }

  public onSubmit() {    
    const changePassData = {
      old_password:this.passwordChangeForm.value.currentPassword,
      new_password:this.passwordChangeForm.value.newPassword
    };
    this._authService.changePassword(changePassData)
      .subscribe( res => {
        this._mesgageService.showSuccess(res.message);
      }, err => {
        this._mesgageService.showError(err.error.message);
      });
  }

  public visibilityOnOff(val: string) {
      if (val === 'curpass') {
        this.isCurPassword = !this.isCurPassword;
        if(this.isCurPassword)
        this.curPasswordType = "password";
        else 
        this.curPasswordType = "text";
      } else if(val === 'newpass') {
        this.isNewPassword = !this.isNewPassword;
        if(this.isNewPassword)
        this.newPasswordType = "password";
        else 
        this.newPasswordType = "text";
      }else{
        this.isCnfPassword = !this.isCnfPassword;
        if(this.isCnfPassword)
        this.cnfPasswordType = "password";
        else 
        this.cnfPasswordType = "text";
      }
  }
}
