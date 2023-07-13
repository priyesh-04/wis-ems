import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MesgageService } from '../../services/shared/message.service';
import { HolidaysService } from '../../services/holidays/holidays.service';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PublicHolidaysComponent } from '../public-holidays/public-holidays.component';
import { getFormattedDate } from "../../utils/custom-validators";

@Component({
  selector: 'app-public-holidays-form',
  templateUrl: './public-holidays-form.component.html',
  styleUrls: ['./public-holidays-form.component.css']
})
export class PublicHolidaysFormComponent implements OnInit {
  public publicHolidaysForm :FormGroup;
    constructor(
      private _mesgageService: MesgageService,
      private _holidaysService: HolidaysService,
      private fb: FormBuilder,
      private publicHolidaysRef: MatDialogRef<PublicHolidaysComponent>,
      @Inject(MAT_DIALOG_DATA) public publicHolidaysDialogData
      ) { }

  ngOnInit(): void {
    this.publicHolidaysForm = this.fb.group({
      date: ["", [Validators.required]],
      event: ["", [Validators.required]],
      description: ["", [Validators.required]],
    });
    if (this.publicHolidaysDialogData.mode === "edit") {
        this.publicHolidaysForm.patchValue({
          date: getFormattedDate(this.publicHolidaysDialogData.holidayData.date),
          event: this.publicHolidaysDialogData.holidayData.event,
          description: this.publicHolidaysDialogData.holidayData.description,
        });
      }
  }
  public get holidayForm() {
    return this.publicHolidaysForm.controls;
  }
  public closeDialog() {
    this.publicHolidaysRef.close();
  }
 /**
  * addHolidays
  */
  public addHolidays(publicHolidaysForm:FormGroup) {
    
    const publicHolidaysFormData = publicHolidaysForm.value;
    if (this.publicHolidaysDialogData.mode === "edit") {
      this._holidaysService.updateHoliday(this.publicHolidaysDialogData.holidayData._id, publicHolidaysFormData).subscribe(
        (res) => {
          this.publicHolidaysRef.close("success");
          this._mesgageService.showSuccess(res.message || 'Holiday Updated successfully'); 
        },
        (err) => {
          this._mesgageService.showError(err.error.message);
        }
      );
    } else if (this.publicHolidaysDialogData.mode === "add") {
      this._holidaysService.addHoliday(publicHolidaysFormData).subscribe(
        (res) => {
          this.publicHolidaysRef.close("success");
          this._mesgageService.showSuccess(res.message || 'Holiday Created successfully'); 
        },
        (err) => {
          this._mesgageService.showError(err.error.message);
        }
      );
    }
  }
}
