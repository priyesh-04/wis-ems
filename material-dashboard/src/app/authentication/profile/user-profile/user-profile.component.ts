import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'app/services/auth/auth.service';
import { FormGroup, FormBuilder,Validators } from "@angular/forms";
import { environment } from "environments/environment";

import {
  validatorIndianMobileNumber,
  validatorEmail,
  validatorTextOnly,
  getFormattedDate,
  getFormattedDatetime,
} from "../../../utils/custom-validators";
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
// export interface userProfileList{
//   name: string,
      
// }
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  public userProfileList : any;
  public imageUrl = environment.image_url;
  public userProfile : string

  constructor( private _userProfile : AuthService,
    private fb: FormBuilder) { }
    
  @Input() editable: boolean = false;
  ngOnInit(): void {
    this.getProfile();
    this.profileForm = this.fb.group({
      name: [""],
      email_id: [""],
      emp_id: [""],
      address: ["" ],
      image: [""],
      phone_num: [""],
      designation:{
        name:[""]
      } 
    });    
  }
  onFileSelect(event) {
    // when file edit it will work 
    // if (event.target.files.length > 0) {
    //   const file = event.target.files[0];
    //   this.profileForm.get('profile').setValue(file);
    // }
  }
  public getProfile(){
    this._userProfile.getProfile().subscribe(
      (res) => {
        this.userProfileList = res.result;  
        let dName = this.userProfileList.designation.name ; 
        this.userProfile =`${this.imageUrl}`+ this.userProfileList.image;
          this.profileForm.patchValue({ 
            name: this.userProfileList.name,
            email_id: this.userProfileList.email_id,
            emp_id: this.userProfileList.emp_id,
            address: this.userProfileList.address,
            phone_num: this.userProfileList.phone_num,
            designation: dName              
          });     
          console.log( this.userProfileList, '55555' );
          console.log( this.userProfileList.designation.name, '55555' );
        
      },
      (err) => {
        console.log(err, "error");
      }
    );
  }
  // public editProfile(){
  //   this.editable = true;
  // }
  public onSubmit(profileForm: FormGroup) {
    this.userProfileList = profileForm.value;
  }
  
}
