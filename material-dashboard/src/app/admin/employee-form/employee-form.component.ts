import { Component, Inject, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import {
  validatorIndianMobileNumber,
  validatorEmail,
  validatorTextOnly,
} from "../../utils/custom-validators";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
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
  employeeForm: FormGroup;
  employeeData: any;
  clientList:[];
  designationList: any;
  selectedDesignation: any;
  selectedRole: any;
  selectedClients : any;
  selectedHolidays : any;
  isAdmin :boolean;
  selectedDays : string[]=[];
  roleList = [
    { value: "employee", viewValue: "Employee" },
    { value: "hr", viewValue: "HR" },
  ];
  holidayList: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  constructor(
    private _employeeService: EmployeeService,
    private _designationService: DesignationService,
    public fb: FormBuilder,
    private _mesgageService: MesgageService,
    private _clientService: ClientService,
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
      role: ["", [Validators.required]],
      assigned_client: ["", [Validators.required]],
      holidays: ["", [Validators.required]]
    });
    if (this.employeeDialogData.role === 'admin') {
      this.isAdmin = true    
    }
    if (this.employeeDialogData.mode === "edit") {
      this.getDesignationList();
      this.getClientList();
      this.selectedDesignation =
        this.employeeDialogData.employeeData.designation._id;
      if (this.employeeDialogData.employeeData.role === "admin") {
        this.roleList.push({ value: "admin", viewValue: "Admin" });
      }
      this.selectedClients = this.employeeDialogData.employeeData.assigned_client;
       let clientId = []
      for (let i = 0; i < this.selectedClients.length; i++) {
        clientId.push(this.selectedClients[i]['_id'])
      }
      console.log(clientId, 'clientId');
      this.selectedHolidays = this.employeeDialogData.employeeData.holidays;      
      for (let index in this.selectedHolidays) {
        this.selectedDays.push(this.selectedHolidays[index])          
        console.log(this.selectedHolidays[index], '888');
      };
      
      console.log(this.selectedDays, 'holidays name');
      console.log(this.selectedClients, 'this.selectedClients');
      console.log(this.selectedHolidays, 'this.selectedHolidays');
      
      this.selectedHolidays = this.employeeDialogData.employeeData.holidays;
      console.log(this.employeeDialogData.employeeData,'main data');      
      this.selectedRole = this.employeeDialogData.employeeData.role;
      this.employeeForm.patchValue({
        emp_id: this.employeeDialogData.employeeData.emp_id,
        name: this.employeeDialogData.employeeData.name,
        email_id: this.employeeDialogData.employeeData.email_id,
        phone_num: this.employeeDialogData.employeeData.phone_num,
        address: this.employeeDialogData.employeeData.address,
        designation: this.employeeDialogData.employeeData.designation._id,
        role: this.employeeDialogData.employeeData.role,
        assigned_client:clientId,
        holidays: this.selectedDays
        
      });
      
      document.getElementById("password-div").style.display = "none";
    } else if (this.employeeDialogData.mode === "add") {
      this.getDesignationList();
      this.getClientList();
      document.getElementById("password-div").style.display = "block";
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
  closeDialog() {
    this.dialogRef.close();
  }

  get myEmployeeForm() {
    return this.employeeForm.controls;
  }

  getDesignationList() {
    this._designationService.getDesignationList().subscribe(
      (res) => {
        this.designationList = res.result;
      },
      (err) => {
        this._mesgageService.showError(err.message);
      }
    );
  }

  onSubmit(employeeForm: FormGroup) {
    this.employeeData = employeeForm.value;
    console.log(this.employeeData);
    if (this.employeeDialogData.mode === "edit") {
      this._employeeService
        .updateEmployee(
          this.employeeDialogData.employeeData._id,
          this.employeeData
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
      this._employeeService.addNewEmployee(this.employeeData).subscribe(
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
