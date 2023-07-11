import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import {
  validatorIndianMobileNumber,
  validatorEmail,
  validatorTextOnly,
} from "../../utils/custom-validators";
import { EmployeeListComponent } from "../employee-list/employee-list.component";
import { DesignationService } from "../../services/designation/designation.service";
import { EmployeeService } from "../../services/employee/employee.service";
import { MesgageService } from "../../services/shared/message.service";
import { ClientService } from "../../services/client/client.service";

@Component({
  selector: "app-employee-form",
  templateUrl: "./employee-form.component.html",
  styleUrls: ["./employee-form.component.css"],
})
export class EmployeeFormComponent implements OnInit {
  public employeeForm: FormGroup;
  public clientList = [];
  public designationList = [];
  public isAdmin :boolean;
  public roleList = [
    { value: "employee", viewValue: "Employee" },
    { value: "hr", viewValue: "HR" },
  ];
  public holidayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(
    private fb: FormBuilder,
    private _employeeService: EmployeeService,
    private _designationService: DesignationService,
    private _mesgageService: MesgageService,
    private _clientService: ClientService,
    private dialogRef: MatDialogRef<EmployeeListComponent>,
    @Inject(MAT_DIALOG_DATA) public employeeDialogData
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      emp_id: ["", [Validators.required]],
      name: ["", [Validators.required, validatorTextOnly]],
      email_id: ["", [Validators.required, validatorEmail]],
      phone_num: ["", [Validators.required, validatorIndianMobileNumber]],
      address: ["", [Validators.required]],
      designation: ["", [Validators.required]],
      role: ["", [Validators.required]],
      assigned_client: ["", [Validators.required]],
      holidays: ["", [Validators.required]]
    });

    this.getDesignationList();
    this.getClientList();

    if (this.employeeDialogData.role === 'admin') {
      this.isAdmin = true;
      // Set default values for admin as an admin will not filled up this fields
      this.employeeForm.patchValue({
        designation: '648171023294ac322071c030',
        role: 'admin',
        assigned_client: ['648183c002532e19d3ea921a'],
        holidays: [0, 6]
      });
    }
    if (this.employeeDialogData.mode === "edit") {
      if (this.employeeDialogData.employeeData.role === "admin") {
        this.roleList.push({ value: "admin", viewValue: "Admin" });
      }
      const clientId = []
      if (!this.isAdmin && this.employeeDialogData.employeeData.assigned_client) {
        const selectedClients = this.employeeDialogData.employeeData.assigned_client;
        for (let i = 0; i < selectedClients.length; i++) {
          clientId.push(selectedClients[i]['_id']);
        }
      }
      const selectedDays = []
      const selectedHolidays = this.employeeDialogData.employeeData.holidays;      
      for (let index in selectedHolidays) {
        selectedDays.push(selectedHolidays[index]);
      };      
      this.employeeForm.patchValue({
        emp_id: this.employeeDialogData.employeeData.emp_id,
        name: this.employeeDialogData.employeeData.name,
        email_id: this.employeeDialogData.employeeData.email_id,
        phone_num: this.employeeDialogData.employeeData.phone_num,
        address: this.employeeDialogData.employeeData.address,
        designation: this.employeeDialogData.employeeData.designation._id,
        role: this.employeeDialogData.employeeData.role,
        assigned_client: this.isAdmin ? this.employeeDialogData.employeeData.assigned_client : clientId,
        holidays: selectedDays
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

  private getDesignationList() {
    this._designationService.getDesignationList().subscribe(
      (res) => {
        this.designationList = res.result;
      },
      (err) => {
        this._mesgageService.showError(err.error.message || 'Unable to fetch designation list');
      }
    );
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public get myEmployeeForm() {
    return this.employeeForm.controls;
  }

  public onSubmit(employeeForm: FormGroup) {
    const employeeData = employeeForm.value;
    if (this.employeeDialogData.mode === "edit") {
      this._employeeService
        .updateEmployee(
          this.employeeDialogData.employeeData._id,
          employeeData
        )
        .subscribe(
          (res) => {
            this.dialogRef.close("success");
            this._mesgageService.showSuccess(res.message);
          },
          (err) => {
            this._mesgageService.showError(err.error.message);
          }
        );
    } else if (this.employeeDialogData.mode === "add") {
      this._employeeService.addNewEmployee(employeeData).subscribe(
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
