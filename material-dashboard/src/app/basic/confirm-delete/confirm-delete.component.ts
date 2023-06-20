import { Component, Inject } from "@angular/core";
import { DesignationService } from "app/services/designation/designation.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ClientService } from "app/services/client/client.service";
import { EmployeeService } from "app/services/employee/employee.service";
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: "confirm-delete",
  templateUrl: "confirm-delete.html",
})
export class ConfirmDeleteComponent {
  constructor(
    private _employeeService: EmployeeService,
    private _designationService: DesignationService,
    private _clientService: ClientService,
    public deleteDialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public deleteDialogData: DialogData
  ) {}

  onNoClick(): void {
    this.deleteDialogRef.close();
  }

  onYesClick(data): void {
    // console.log(data, 'oooo');
    console.log(this._employeeService);    
    if (data.callingFrom === "designation") {
      this.deleteDesignation(data.id);
    } else if (data.callingFrom === "deleteSingleTask") {
      this.deleteSingleTask(data);      
    } else if (data.callingFrom === "editReqAdmin") {
      this.editReqAdmin(data.timesheet_id, data);     
    } else if (data.callingFrom === "reqTaskApprove") {
      this.reqTaskApprove(data.timesheet_id);     
    } else if (data.callingFrom === "client") {
      this.deleteClient(data.id);
    }
  }
  deleteSingleTask(data) {
    this._employeeService.deleteSingleTask(data.timesheet_id, data.tasksheet_id, data).subscribe(      
      (res) => {
        console.log(res, "res");
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this.deleteDialogRef.close(err);
        console.log(err, "error");
      }
    );
  }
  editReqAdmin(timesheet_id:number, data) {
    this._employeeService.editReqAdmin(timesheet_id, data).subscribe(      
      (res) => {
        console.log(res, "res");
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this.deleteDialogRef.close(err);
        console.log(err, "error");
      }
    );
  }
  
  deleteDesignation(id: number) {
    this._designationService.deleteDesignation(id).subscribe(
      (res) => {
        console.log(res, "res");
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this.deleteDialogRef.close(err);
        console.log(err, "error");
      }
    );
  }

  deleteClient(id: number) {
    this._clientService.deleteClient(id).subscribe(
      (res) => {
        console.log(res, "res");
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this.deleteDialogRef.close(err);
        console.log(err, "error");
      }
    );
  }
  reqTaskApprove(timesheet_id: number) {
    this._employeeService.actionAdmin(timesheet_id).subscribe(
      (res) => {
        console.log(res, "res");
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this.deleteDialogRef.close(err);
        console.log(err, "error");
      }
    );
  }
  
}
