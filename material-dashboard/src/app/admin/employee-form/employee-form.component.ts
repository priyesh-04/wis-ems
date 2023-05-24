import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  validatorIndianMobileNumber,
  validatorEmail,
  validatorTextOnly,
} from "../../utils/custom-validators";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EmployeeListComponent } from "../employee-list/employee-list.component";
import { DesignationService } from "app/services/designation/designation.service";
import { EmployeeService } from "app/services/employee/employee.service";

@Component({
  selector: "app-employee-form",
  templateUrl: "./employee-form.component.html",
  styleUrls: ["./employee-form.component.css"],
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  employeeData: any;
  designationList: any;
  selectedDesignation: any;

  constructor(
    private _employeeService: EmployeeService,
    private _designationService: DesignationService,
    public fb: FormBuilder,

    public dialogRef: MatDialogRef<EmployeeListComponent>,
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
      password: ["", [Validators.required]],
    });

    if (this.employeeDialogData.mode === "edit") {
      this.getDesignationList();
      this.selectedDesignation =
        this.employeeDialogData.employeeData.designation;
      this.employeeForm.patchValue({
        emp_id: this.employeeDialogData.employeeData.emp_id,
        name: this.employeeDialogData.employeeData.name,
        email_id: this.employeeDialogData.employeeData.email_id,
        phone_num: this.employeeDialogData.employeeData.phone_num,
        address: this.employeeDialogData.employeeData.address,
        designation: this.employeeDialogData.employeeData.designation,
      });
      document.getElementById("password-div").style.display = "none";
    } else if (this.employeeDialogData.mode === "add") {
      this.getDesignationList();
      document.getElementById("password-div").style.display = "block";
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  get myEmployeeForm() {
    return this.employeeForm.controls;
  }

  getDesignationList() {
    this._designationService.getDesignationList().subscribe(
      (res) => {
        this.designationList = res.details;
      },
      (err) => {
        console.log(err, "error");
      }
    );
  }

  onSubmit(employeeForm: FormGroup) {
    this.employeeData = employeeForm.value;
    if (this.employeeDialogData.mode === "edit") {
      this._employeeService
        .updateEmployee(
          this.employeeDialogData.employeeData._id,
          this.employeeData
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
    } else if (this.employeeDialogData.mode === "add") {
      this._employeeService.addNewEmployee(this.employeeData).subscribe(
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