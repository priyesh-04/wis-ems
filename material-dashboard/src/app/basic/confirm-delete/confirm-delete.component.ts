import { Component, Inject } from "@angular/core";
import { DesignationService } from "app/services/designation/designation.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ClientService } from "../../services/client/client.service";
import { EmployeeService } from "../../services/employee/employee.service";
import { AuthService } from "../../services/auth/auth.service";
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: "confirm-delete",
  templateUrl: "confirm-delete.html",
})
export class ConfirmDeleteComponent {
  public isApprove :boolean

  constructor(
    private _employeeService: EmployeeService,
    private _designationService: DesignationService,
    public _authService: AuthService,
    private _clientService: ClientService,
    public deleteDialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public deleteDialogData: DialogData
  ) {}

  onNoClick(): void {
    this.deleteDialogRef.close();
  }

  onYesClick(data): void {  
    if (data.callingFrom === "designation") {
      this.deleteDesignation(data.id);
    } else if (data.callingFrom === "deleteSingleTask") {
      this.deleteSingleTask(data)     
    }else if (data.callingFrom === "deleteTask") {
      this.deleteDialogRef.close("success");   
    } else if (data.callingFrom === "logOut") {
      this._authService.performLogout();
      this.deleteDialogRef.close("success");  
    } else if (data.callingFrom === "editReqAdmin") {
      this.editReqAdmin(data.timesheet_id, data);     
    } else if (data.callingFrom === "reqTaskApprove") {
      this.reqTaskApprove(data.timesheet_id, this.isApprove = true);     
    } else if (data.callingFrom === "reqTaskReject") {
      this.reqTaskReject(data.timesheet_id, this.isApprove = false);     
    } else if (data.callingFrom === "client") {
      this.deleteClient(data.id);
    }
  }
  deleteSingleTask(data) {
    this._employeeService.deleteSingleTask(data.timesheet_id, data.tasksheet_id, data).subscribe(      
      (res) => {
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this.deleteDialogRef.close(err);
      }
    );
  }
  editReqAdmin(timesheet_id:number, data) {
    this._employeeService.editReqAdmin(timesheet_id, data).subscribe(      
      (res) => {
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this.deleteDialogRef.close(err);
      }
    );
  }
  
  deleteDesignation(id: number) {
    this._designationService.deleteDesignation(id).subscribe(
      (res) => {
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this.deleteDialogRef.close(err);
      }
    );
  }

  deleteClient(id: number) {
    this._clientService.deleteClient(id).subscribe(
      (res) => {
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this.deleteDialogRef.close(err);
      }
    );
  }
  reqTaskApprove(timesheet_id: number, isApprove:boolean) {
    this._employeeService.actionAdmin(timesheet_id, isApprove ).subscribe(
      (res) => {
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this.deleteDialogRef.close(err);
      }
    );
  }
  reqTaskReject(timesheet_id: number, isApprove:boolean) {
    this._employeeService.actionAdmin(timesheet_id, isApprove).subscribe(
      (res) => {
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this.deleteDialogRef.close(err);
      }
    );
  }
}
