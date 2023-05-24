import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
            public fb: FormBuilder) {}

  ngOnInit(): void {
    this.passwordChangeForm = this.fb.group({
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
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
    this._authService.changePassword(this.passwordChangeForm.value)
      .subscribe( res => {
        this.isLoading = false;
        this.isLoaded = false;
        this._router.navigate(['/home']);
      }, err => {
        this.isLoading = false;
        this.isLoaded = false;
        alert(err.error.detail);
        console.log(err, 'error');
      });

  }

}
