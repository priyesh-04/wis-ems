import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import {
  formatDateToDDMMYYYY,
  formatToDateTime,
  getMaxDateTime,
  getMinDateTime,
  getTodayDateTime,
} from "../../utils/custom-validators";
import { EmployeeService } from "../../services/employee/employee.service";
import { MesgageService } from "../../services/shared/message.service";
import { SubmitModes } from "../utils/TimesheetConstants";
import { ListTimesheetComponent } from "../list-timesheet/list-timesheet.component";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "app-timesheet-update",
  templateUrl: "./timesheet-update.component.html",
  styleUrls: ["./timesheet-update.component.css"],
})
export class TimesheetUpdateComponent implements OnInit {
  public timesheetForm: FormGroup;
  public clientList = [];
  public minDateTime:string='';
  public maxDateTime:string='';

  constructor(
    private _employeeService: EmployeeService,
    private _mesgageService: MesgageService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ListTimesheetComponent>,
    @Inject(MAT_DIALOG_DATA) public timesheetDialogData,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getClientList();
    this.minDateTime=getMinDateTime(1);
    this.maxDateTime=getMaxDateTime(1);

    this.timesheetForm = this.fb.group({
      date: {value: formatDateToDDMMYYYY(this.timesheetDialogData.timesheetData.date), disabled: true},
      in_time: {value:formatToDateTime(this.timesheetDialogData.timesheetData.in_time), disabled: true},
      out_time: {value: this.timesheetDialogData.timesheetData.out_time ? formatToDateTime(this.timesheetDialogData.timesheetData.out_time) : "", disabled: true},
      client: ["", [Validators.required]],
      start_time: [getTodayDateTime(), [Validators.required]],
      end_time: [getTodayDateTime(), [Validators.required]],
      description: ["", [Validators.required]],
    });

    if (this.timesheetDialogData.mode === SubmitModes.SingleEdit) {
      const taskDetails =
        this.timesheetDialogData.timesheetData.task_details.find(
          (task) => task._id === this.timesheetDialogData.taskID
        );
      this.timesheetForm.patchValue({
        client: taskDetails.client._id,
        start_time: formatToDateTime(taskDetails.start_time),
        end_time:formatToDateTime(taskDetails.end_time),
        description: taskDetails.description,
      });
    }
  }

  private getClientList() {
    // this._clientService.getClientList().subscribe(
    //   (res) => {
    //     this.clientList = res.result;
    //   },
    //   (err) => {
    //     this._mesgageService.showError(err.error.message || 'Unable to fetch client list');
    //   }
    // );
    this._authService.getProfile().subscribe(
      (res) => {
        this.clientList = res.result.assigned_client;
      },
      (err) => {
        this._mesgageService.showError(err.error.message || 'Unable to fetch data');
      }
    );
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public onSubmit(timesheetForm: FormGroup) {
    const timesheetData = timesheetForm.value;    
    if (this.timesheetDialogData.mode === SubmitModes.SingleEdit) {      
      const taskData = {
        _id : this.timesheetDialogData.taskID,
        client: timesheetData.client,
        description: timesheetData.description,
        start_time: timesheetData.start_time +":00+05:30",
        end_time: timesheetData.end_time  +":00+05:30",
      }

      this._employeeService
        .updateSingleTask(this.timesheetDialogData.timesheetData._id, taskData)
        .subscribe(
          (res) => {
            this.dialogRef.close("success");
            this._mesgageService.showSuccess(res.message);
          },
          (err) => {
            this._mesgageService.showError(err.error.message);
          }
        );
    } else if (this.timesheetDialogData.mode === SubmitModes.SingleAdd) {
      const taskData = {
        client: timesheetData.client,
        start_time: timesheetData.start_time +":00+05:30",
        end_time: timesheetData.end_time +":00+05:30",
        description: timesheetData.description,
      }

      this._employeeService.addSingleTask(this.timesheetDialogData.timesheetData._id, taskData).subscribe(
        (res) => {
          this.dialogRef.close("success");
          this._mesgageService.showSuccess(res.message);
        },
        (err) => {
          this._mesgageService.showError(err.error.message);
        }
      );
    }
  }
}
