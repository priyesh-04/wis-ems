import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import {
  getFormattedDate,
  getFormattedDatetime,
} from "../../utils/custom-validators";
import { EmployeeService } from "../../services/employee/employee.service";
import { ClientService } from "../../services/client/client.service";
import { MesgageService } from "../../services/shared/message.service";
import { SubmitModes } from "../utils/TimesheetConstants";
import { ListTimesheetComponent } from "../list-timesheet/list-timesheet.component";

@Component({
  selector: "app-timesheet-update",
  templateUrl: "./timesheet-update.component.html",
  styleUrls: ["./timesheet-update.component.css"],
})
export class TimesheetUpdateComponent implements OnInit {
  public timesheetForm: FormGroup;
  public clientList = [];

  constructor(
    private _employeeService: EmployeeService,
    private _clientService: ClientService,
    private _mesgageService: MesgageService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ListTimesheetComponent>,
    @Inject(MAT_DIALOG_DATA) public timesheetDialogData
  ) {}

  ngOnInit(): void {
    this.getClientList();

    this.timesheetForm = this.fb.group({
      date: {value: getFormattedDate(this.timesheetDialogData.timesheetData.date), disabled: true},
      in_time: {value: getFormattedDatetime(this.timesheetDialogData.timesheetData.in_time), disabled: true},
      out_time: {value: this.timesheetDialogData.timesheetData.out_time ? getFormattedDatetime(this.timesheetDialogData.timesheetData.out_time) : "", disabled: true},
      client: ["", [Validators.required]],
      project_name: ["", [Validators.required]],
      start_time: ["", [Validators.required]],
      end_time: ["", [Validators.required]],
      description: ["", [Validators.required]],
    });

    if (this.timesheetDialogData.mode === SubmitModes.SingleEdit) {
      const taskDetails =
        this.timesheetDialogData.timesheetData.task_details.find(
          (task) => task._id === this.timesheetDialogData.taskID
        );
      this.timesheetForm.patchValue({
        client: taskDetails.client._id,
        project_name: taskDetails.project_name,
        start_time: getFormattedDatetime(taskDetails.start_time),
        end_time: getFormattedDatetime(taskDetails.end_time),
        description: taskDetails.description,
      });
    }
  }

  private getClientList() {
    this._clientService.getClientList().subscribe(
      (res) => {
        this.clientList = res.result;
      },
      (err) => {
        this._mesgageService.showError(err.error.message || 'Unable to fetch client list');
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
        project_name: timesheetData.project_name,
        description: timesheetData.description,
        start_time: timesheetData.start_time,
        end_time: timesheetData.end_time,
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
        project_name: timesheetData.project_name,
        start_time: timesheetData.start_time,
        end_time: timesheetData.end_time,
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
