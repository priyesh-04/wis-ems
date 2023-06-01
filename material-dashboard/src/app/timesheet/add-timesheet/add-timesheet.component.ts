import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  validatorIndianMobileNumber,
  validatorEmail,
  validatorTextOnly,
} from "../../utils/custom-validators";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DesignationService } from "app/services/designation/designation.service";
import { EmployeeService } from "app/services/employee/employee.service";
import { TimesheetListComponent } from "../timesheet-list/timesheet-list.component";
import { ClientService } from "app/services/client/client.service";

@Component({
  selector: "app-add-timesheet",
  templateUrl: "./add-timesheet.component.html",
  styleUrls: ["./add-timesheet.component.css"],
})
export class AddTimesheetComponent implements OnInit {
  timesheetForm: FormGroup;
  timesheetData: any;
  clientList: any;
  selectedClient: any;

  constructor(
    private _employeeService: EmployeeService,
    private _clientService: ClientService,
    public fb: FormBuilder,

    public dialogRef: MatDialogRef<TimesheetListComponent>,
    @Inject(MAT_DIALOG_DATA) public timesheetDialogData
  ) {}

  ngOnInit(): void {
    this.timesheetForm = this.fb.group({
      date: ["", [Validators.required]],
      in_time: ["", [Validators.required]],
      out_time: ["", [Validators.required]],
      client: ["", [Validators.required, validatorTextOnly]],
      project_name: ["", [Validators.required]],
      start_time: ["", [Validators.required]],
      end_time: ["", [Validators.required]],
      description: ["", [Validators.required]],
    });

    if (this.timesheetDialogData.mode === "edit") {
      this.getClientList();
      this.selectedClient = this.timesheetDialogData.timesheetData.client_name;
      this.timesheetForm.patchValue({
        date: this.timesheetDialogData.timesheetData.date,
        in_time: this.timesheetDialogData.timesheetData.in_time,
        out_time: this.timesheetDialogData.timesheetData.out_time,
        client: this.timesheetDialogData.timesheetData.client,
        project_name: this.timesheetDialogData.timesheetData.project_name,
        start_time: this.timesheetDialogData.timesheetData.start_time,
        end_time: this.timesheetDialogData.timesheetData.end_time,
        description: this.timesheetDialogData.timesheetData.description,
      });
    } else if (this.timesheetDialogData.mode === "add") {
      this.getClientList();
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
        console.log(this.clientList, "client list");
      },
      (err) => {
        console.log(err, "error");
      }
    );
  }

  onSubmit(timesheetForm: FormGroup) {
    this.timesheetData = timesheetForm.value;
    if (this.timesheetDialogData.mode === "edit") {
      this._employeeService
        .updateEmployee(
          this.timesheetDialogData.timesheetData._id,
          this.timesheetData
        )
        .subscribe(
          (res) => {
            this.dialogRef.close("success");
          },
          (err) => {
            alert(err.error.detail);
            console.log(err, "error");
          }
        );
    } else if (this.timesheetDialogData.mode === "add") {
      this._employeeService.addTimesheet(this.timesheetData).subscribe(
        (res) => {
          this.dialogRef.close("success");
        },
        (err) => {
          alert(err.error.detail);
          console.log(err, "error");
        }
      );
    }
  }
}
