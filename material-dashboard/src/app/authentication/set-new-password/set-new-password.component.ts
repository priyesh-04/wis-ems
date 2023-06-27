import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";
import { CookieService } from "ngx-cookie-service";

interface editObjetPass {
  password :string
}
@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.css']
})
export class SetNewPasswordComponent implements OnInit {
  public resetPass: FormGroup;
  private userId :string;
  private token : string;
  
  constructor(public fb: FormBuilder,
    public _authService: AuthService,
    public _router: Router,
    public _cookieService: CookieService,
    public _route: ActivatedRoute,
    private activatedRoute: ActivatedRoute) {
      
    }

  
  ngOnInit(): void {
    this.resetPass = this.fb.group({
      password: ["", [Validators.required]],
      conPassword: ["", [Validators.required]],
    })   
    let params = this.activatedRoute.snapshot.params;
      this.userId = params['userId'];
      this.token = params['token'];
    console.log(params, '000');
    
  }
  // get lForm() {
  //   return this.resetPass.controls;
  // }
 /**
  * resetPassword
  */
 public resetPassword(resetPass:FormGroup) {
  
  console.log(this.resetPass, 'resetPass');
  if (this.resetPass.value.password != this.resetPass.value.conPassword) {
    // alert('pass not match')
  }else
  {
    // this.resetPass = resetPass.value;
    console.log(this.resetPass, 'this.resetPass');
    
    const editObj ={
      password:this.resetPass.value.password
    }
    
    console.log(this.resetPass);
    this._authService.setNewPassword(editObj, this.userId, this.token).subscribe(
      (data) => {
        
        console.log("login success", data);
        this._router.navigate(['/login']);
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
}
