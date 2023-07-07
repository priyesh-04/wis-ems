import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { AuthService } from "../../services/auth/auth.service";
import { MesgageService } from '../../services/shared/message.service';

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
      password: ["", [Validators.required,
        Validators.pattern(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g
        ),
        Validators.minLength(8),
      ]],
      conPassword: ["", [Validators.required,
        Validators.pattern(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g
        ),
        Validators.minLength(8),]],
    })   
    let params = this.activatedRoute.snapshot.params;
      this.userId = params['userId'];
      this.token = params['token'];
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
          this._mesgageService.showError(data.message || 'Password changed successfully');
          this._router.navigate(['/login']);
        },
        (err) => {
          this._mesgageService.showError(err.error.message);
        }
      );
    }
  }
}
