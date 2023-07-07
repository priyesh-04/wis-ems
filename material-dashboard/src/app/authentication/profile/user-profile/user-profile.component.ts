import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { environment } from 'environments/environment';

import { AuthService } from '../../../services/auth/auth.service';
import { MesgageService } from '../../../services/shared/message.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit {
  @Input() editable: boolean = false;

  private imageUrl = environment.image_url;
  public profileForm: FormGroup;
  public userProfile : string

  constructor(
    private _userProfile : AuthService,
    private _mesgageService: MesgageService,
    private fb: FormBuilder
  ) {}    

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

  public getProfile(){
    this._userProfile.getProfile().subscribe(
      (res) => {
        const userProfileList = res.result;
        this.userProfile =`${this.imageUrl}`+ userProfileList.image;

        this.profileForm.patchValue({ 
          name: userProfileList.name,
          email_id: userProfileList.email_id,
          emp_id: userProfileList.emp_id,
          address: userProfileList.address,
          phone_num: userProfileList.phone_num,
          designation: userProfileList.designation?.name,              
        });
      },
      (err) => {
        this._mesgageService.showError(err.error.message || 'Unable to fetch profile details');
      }
    );
  }
}
