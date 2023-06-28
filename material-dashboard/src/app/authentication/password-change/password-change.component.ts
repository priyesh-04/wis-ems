import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MesgageService } from "../../services/shared/message.service";

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {
  passwordChangeForm: FormGroup;

  isLoading = false;
  isLoaded = false;

  constructor(public _authService: AuthService,
            public _router: Router,
            public _cookieService: CookieService,
            public _route: ActivatedRoute,
            private _mesgageService: MesgageService,
            public fb: FormBuilder) {}

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

  get pcForm() {
    return this.passwordChangeForm.controls;
  }

  onSubmit() {
    if (!this.isLoaded) {
      this.isLoading = true;
      this.isLoaded = true;
    }
    console.log(this.passwordChangeForm.value, '22');
    
    const changePassData ={
      old_password:this.passwordChangeForm.value.currentPassword,
      new_password:this.passwordChangeForm.value.newPassword
    }
    this._authService.changePassword(changePassData)
      .subscribe( res => {
        this.isLoading = false;
        this.isLoaded = false;
        this._router.navigate(['/login']);
        this._authService.performLogout()
        this._mesgageService.showSuccess(res.message);
      }, err => {
        this.isLoading = false;
        this.isLoaded = false;
        this._mesgageService.showError(err.error.message);
      });

  }

}
