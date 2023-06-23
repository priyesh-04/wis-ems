import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import {
  getFormattedDate,
  getFormattedDatetime,
} from "../../utils/custom-validators";
import { TimesheetListComponent } from "../timesheet-list/timesheet-list.component";
import { EmployeeService } from "../../services/employee/employee.service";
import { ClientService } from "../../services/client/client.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-timesheet-update",
  templateUrl: "./timesheet-update.component.html",
  styleUrls: ["./timesheet-update.component.css"],
})
export class TimesheetUpdateComponent implements OnInit {
  private currentDate: string;
  timesheetForm: FormGroup;
  timesheetData: any;
  clientList: any;
  selectedClient: any;

  constructor(
    private _employeeService: EmployeeService,
    private _clientService: ClientService,
    private datepipe: DatePipe,
    public fb: FormBuilder,

    public dialogRef: MatDialogRef<TimesheetListComponent>,
    @Inject(MAT_DIALOG_DATA) public timesheetDialogData
  ) {}

  ngOnInit(): void {
    this.currentDate = this.datepipe.transform((new Date), 'yyyy-MM-dd');
    this.timesheetForm = this.fb.group({
      date: { disabled: true, value: this.currentDate },
      in_time: ["", [Validators.required]],
      out_time: ["", [Validators.required]],
      client: ["", [Validators.required]],
      project_name: ["", [Validators.required]],
      start_time: ["", [Validators.required]],
      end_time: ["", [Validators.required]],
      description: ["", [Validators.required]],
    });

    if (this.timesheetDialogData.mode === "edit") {
      this.getClientList();
      const taskDetails =
        this.timesheetDialogData.timesheetData.task_details.find(
          (task) => task._id === this.timesheetDialogData.taskID
        );
      this.selectedClient = taskDetails.client._id;
      this.timesheetForm.patchValue({
        date: getFormattedDate(this.timesheetDialogData.timesheetData.date),
        in_time: getFormattedDatetime(
          this.timesheetDialogData.timesheetData.in_time
        ),
        out_time: getFormattedDatetime(
          this.timesheetDialogData.timesheetData.out_time
        ),
        client: taskDetails.client._id,
        project_name: taskDetails.project_name,
        start_time: getFormattedDatetime(taskDetails.start_time),
        end_time: getFormattedDatetime(taskDetails.end_time),
        description: taskDetails.description,
      });
    } else if (this.timesheetDialogData.mode === "single-edit") {
      this.getClientList();
      const taskDetails =
        this.timesheetDialogData.timesheetData.task_details.find(
          (task) => task._id === this.timesheetDialogData.taskID
        );
      this.selectedClient = taskDetails.client._id;
      this.timesheetForm.patchValue({
        date: getFormattedDate(this.timesheetDialogData.timesheetData.date),
        in_time: getFormattedDatetime(
          this.timesheetDialogData.timesheetData.in_time
        ),
        out_time: getFormattedDatetime(
          this.timesheetDialogData.timesheetData.out_time
        ),
        client: taskDetails.client._id,
        project_name: taskDetails.project_name,
        start_time: getFormattedDatetime(taskDetails.start_time),
        end_time: getFormattedDatetime(taskDetails.end_time),
        description: taskDetails.description,
      });
    } else if (this.timesheetDialogData.mode === "add") {
      this.getClientList();
    } else if (this.timesheetDialogData.mode === "all-edit") {
      this.getClientList();
      const taskDetails =
        this.timesheetDialogData.timesheetData.task_details.find(
          (task) => task._id === this.timesheetDialogData.taskID
        );
      this.selectedClient = taskDetails.client._id;
      this.timesheetForm.patchValue({
        date: getFormattedDate(this.timesheetDialogData.timesheetData.date),
        in_time: getFormattedDatetime(
          this.timesheetDialogData.timesheetData.in_time
        ),
        out_time: getFormattedDatetime(
          this.timesheetDialogData.timesheetData.out_time
        ),
        client: taskDetails.client._id,
        project_name: taskDetails.project_name,
        start_time: getFormattedDatetime(taskDetails.start_time),
        end_time: getFormattedDatetime(taskDetails.end_time),
        description: taskDetails.description,
      });
    } else if (this.timesheetDialogData.mode === "single-Task-add") {
      this.getClientList();
      this.timesheetForm.patchValue({
        date: getFormattedDate(this.timesheetDialogData.timesheetData.date),
        in_time: getFormattedDatetime(
          this.timesheetDialogData.timesheetData.in_time
        ),
        out_time: getFormattedDatetime(
          this.timesheetDialogData.timesheetData.out_time
        ),
      });
    } else if (this.timesheetDialogData.mode === "Task-add") {
      this.getClientList();
      this.timesheetForm.patchValue({
        date: getFormattedDate(this.timesheetDialogData.timesheetData.date),
        in_time: getFormattedDatetime(
          this.timesheetDialogData.timesheetData.in_time
        ),
        out_time: getFormattedDatetime(
          this.timesheetDialogData.timesheetData.out_time
        ),
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  get myTimesheetForm() {
    return this.timesheetForm.controls;
  }

  getClientList() {
    this._clientService.getClientList().subscribe(
      (res) => {
        this.clientList = res.result;
      },
      (err) => {
        alert(err.error.detail);
      }
    );
  }

  onSubmit(timesheetForm: FormGroup) {
    this.timesheetData = timesheetForm.value;
    const myData = {
      date: this.currentDate,
      in_time: this.timesheetData.in_time,
      out_time: this.timesheetData.out_time,
      task_details: [
        {
          client: this.timesheetData.client,
          project_name: this.timesheetData.project_name,
          start_time: this.timesheetData.start_time,
          end_time: this.timesheetData.end_time,
          description: this.timesheetData.description,
        },
      ],
      id : this.timesheetDialogData.timesheetData._id
    };   
    
    if (this.timesheetDialogData.mode === "edit") {
      delete myData.date;
      delete myData.in_time;
      delete myData.out_time;
      myData.task_details[0]["_id"] = this.timesheetDialogData.taskID;
      this._employeeService
        .updateTimesheet(this.timesheetDialogData.taskID, myData)
        .subscribe(
          (res) => {
            this.dialogRef.close("success");
          },
          (err) => {
            alert(err.error.detail);
          }
        );
    } else if (this.timesheetDialogData.mode === "single-edit") {
      
      let singleTaskData = {
        _id : this.timesheetDialogData.taskID,
        client: this.timesheetData.client,
        project_name: this.timesheetData.project_name,
        description: this.timesheetData.description,
      }
      myData.task_details[0]["_id"] = this.timesheetDialogData.taskID;
      this._employeeService
        .updateSingleTask(this.timesheetDialogData.timesheetData._id, singleTaskData)
        .subscribe(
          (res) => {
            this.dialogRef.close("success");
          },
          (err) => {
            alert(err.error.detail);
          }
        );
    } else if (this.timesheetDialogData.mode === "single-Task-add") {
      let clientSingleData = {
        client: this.timesheetData.client,
        project_name: this.timesheetData.project_name,
        start_time: this.timesheetData.start_time,
        end_time: this.timesheetData.end_time,
        description: this.timesheetData.description,
      }
      this._employeeService.addSingleTask(myData.id, clientSingleData).subscribe(
        (res) => {
          this.dialogRef.close("success");
        },
        (err) => {
          alert(err.error.detail);
        }
      );
    } else if (this.timesheetDialogData.mode === "all-edit") {
      this._employeeService.allEditTimesheet(myData.id, myData).subscribe(
        (res) => {
          this.dialogRef.close("success");
        },
        (err) => {
          alert(err.error.detail);
        }
      );
    } else if (this.timesheetDialogData.mode === "add" || "Task-add") {
      this._employeeService.addTimesheet(myData).subscribe(
        (res) => {
          this.dialogRef.close("success");
        },
        (err) => {
          alert(err.error.detail);
        }
      );
    }
  }
}
