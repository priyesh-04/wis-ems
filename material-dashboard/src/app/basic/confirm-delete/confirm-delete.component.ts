import { Component, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { ClientService } from "../../services/client/client.service";
import { EmployeeService } from "../../services/employee/employee.service";
import { AuthService } from "../../services/auth/auth.service";
import { MesgageService } from "../../services/shared/message.service";
import { DesignationService } from "../../services/designation/designation.service";

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: "confirm-delete",
  templateUrl: "confirm-delete.html",
})
export class ConfirmDeleteComponent {
  public isApprove : string
  public logoutTitle : any
  public editRequestReason: string;

  constructor(
    private _employeeService: EmployeeService,
    private _designationService: DesignationService,
    private _authService: AuthService,
    private _clientService: ClientService,
    private _mesgageService: MesgageService,
    private _router: Router,
    private deleteDialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public deleteDialogData: DialogData
  ) {}
 
  ngOnInit(){
    this.logoutTitle = this.deleteDialogRef.componentInstance.deleteDialogData
  }

  public onYesClick(data): void {    
    if (data.callingFrom === "designation") {
      this.deleteDesignation(data.id);
    } else if (data.callingFrom === "deleteSingleTask") {
      this.deleteSingleTask(data)     
    }else if (data.callingFrom === "deleteTask") {
      this.deleteDialogRef.close("success");   
    } else if (data.callingFrom === "logOut") {
      this.profileLogout(data.userId)  
    } else if (data.callingFrom === "editReqAdmin") {
      this.editReqAdmin(data.timesheet_id);     
    } else if (data.callingFrom === "reqTaskApprove") {
      this.reqTaskApprove(data.timesheet_id, this.isApprove = 'Accepted');     
    } else if (data.callingFrom === "reqTaskReject") {
      this.reqTaskReject(data.timesheet_id, this.isApprove = 'Rejected');     
    } else if (data.callingFrom === "employeeStatus") {
      console.log(data.userId);
      
      this.employeeInactive(data.userId);
    } else if (data.callingFrom === "client") {
      this.employeeInactive(data.id);
    }
  }

  public onNoClick(): void {
    this.deleteDialogRef.close();
  }

  private employeeInactive(id) {
    this._employeeService.employeeStatus(id).subscribe(      
      (res) => {
        this._mesgageService.showSuccess(res.message);
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this._mesgageService.showError(err.error.message);
        this.deleteDialogRef.close(err);
      }
    );
  }

  private profileLogout(userId) {
    this._authService.performLogout(userId).subscribe(      
      (res) => {
        this._router.navigate(["/login"]);
        this._mesgageService.showSuccess(res.message || "Logout Successfully");
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this._mesgageService.showError(err.error.message);
        this.deleteDialogRef.close(err);
      }
    );
  }

  private deleteSingleTask(data) {
    this._employeeService.deleteSingleTask(data.timesheet_id, data.tasksheet_id, data).subscribe(      
      (res) => {
        this._mesgageService.showSuccess(res.message || "Task Deleted Successfully");
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this._mesgageService.showError(err.error.message);
        this.deleteDialogRef.close(err);
      }
    );
  }
  
  private editReqAdmin(timesheet_id: number) {
    if (!this.editRequestReason) {
      this._mesgageService.showError("Enter a reason");
      return;
    }
    this._employeeService.editReqAdmin(timesheet_id, this.editRequestReason).subscribe(      
      (res) => {
        this._mesgageService.showSuccess(res.message || "Task Edit Request Send Successfully");
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this._mesgageService.showError(err.error.message);
        this.deleteDialogRef.close(err);
      }
    );
  }
  
  private deleteDesignation(id: number) {
    this._designationService.deleteDesignation(id).subscribe(
      (res) => {
        this._mesgageService.showSuccess(res.message || "Designation Deleted Successfully");
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this.deleteDialogRef.close(err);
      }
    );
  }

  private deleteClient(id: number) {
    this._clientService.deleteClient(id).subscribe(
      (res) => {
        this._mesgageService.showSuccess(res.message || "Client Deleted Successfully");
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this.deleteDialogRef.close(err);
      }
    );
  }

  private reqTaskApprove(timesheet_id: number, isApprove:string) {
    this._employeeService.actionAdmin(timesheet_id, isApprove ).subscribe(
      (res) => {
        this._mesgageService.showSuccess(res.message || "Request Approved Successfully");
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this.deleteDialogRef.close(err);
      }
    );
  }

  private reqTaskReject(timesheet_id: number, isApprove:string) {
    this._employeeService.actionAdmin(timesheet_id, isApprove).subscribe(
      (res) => {
        this._mesgageService.showSuccess(res.message || "Request Rejected Successfully");
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this.deleteDialogRef.close(err);
      }
    );
  }
}
