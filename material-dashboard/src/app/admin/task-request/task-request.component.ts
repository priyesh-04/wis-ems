import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee/employee.service';
import { getFormattedDate } from "../../utils/custom-validators";
import { ConfirmDeleteComponent } from '../../basic/confirm-delete/confirm-delete.component';
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-task-request',
  templateUrl: './task-request.component.html',
  styleUrls: ['./task-request.component.css']
})
export class TaskRequestComponent implements OnInit {
  public allEditReqList = [];  
  public alertMessage: string = "";
  public alertType: string = "";

  constructor(private _allEditReqAdmin :EmployeeService,
    public dialog: MatDialog, ) { }

  ngOnInit(): void {
    this.getAllEditReqAdmin();
  }
  private getAllEditReqAdmin(){
    this._allEditReqAdmin.allEditReqAdmin().subscribe(
      (res) => {
        this.allEditReqList = res.result;
        // this.date=getFormattedDate(this.allEditReqList.date),
        console.log(this.allEditReqList, "allEditReqList");
      },
      (err) => {
        console.log(err, "error");
      }
    );
  }
  public approveDialog(id:number) {
    const deleteDialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        title: "Requested Task",
        message: "Are you sure you want to Edit the Approve this Task?",
        timesheet_id: id,
        callingFrom: "reqTaskApprove",
      },
    });

    deleteDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.getAllEditReqAdmin();
        this.alertType = "success";
        this.alertMessage = "Designation Deleted Successfully!";
        setTimeout(() => {
          this.alertMessage = "";
        }, 3000);
      } else if (result.error) {
        this.alertType = "danger";
        this.alertMessage = result.error.message;
        setTimeout(() => {
          this.alertMessage = "";
        }, 3000);
      }
    });
  }
  public rejectDialog(id:number) {
    const deleteDialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        title: "Requested Task",
        message: "Are you sure you want to Reject the Task Edit Request?",
        timesheet_id: id,
        callingFrom: "reqTaskReject",
      },
    });

    deleteDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.getAllEditReqAdmin();
        this.alertType = "success";
        this.alertMessage = "Designation Deleted Successfully!";
        setTimeout(() => {
          this.alertMessage = "";
        }, 3000);
      } else if (result.error) {
        this.alertType = "danger";
        this.alertMessage = result.error.message;
        setTimeout(() => {
          this.alertMessage = "";
        }, 3000);
      }
    });
  }
}
