import {
  Component,
  OnInit,
  ElementRef,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { EmployeeService } from "app/services/employee/employee.service";
import { AddTimesheetComponent } from "../add-timesheet/add-timesheet.component";
import { AuthService } from "app/services/auth/auth.service";
import { ActivatedRoute } from "@angular/router";
import { TimesheetUpdateComponent } from "../timesheet-update/timesheet-update.component";
import { ConfirmDeleteComponent } from "app/basic/confirm-delete/confirm-delete.component";

@Component({
  selector: "app-list-timesheet",
  templateUrl: "./list-timesheet.component.html",
  styleUrls: ["./list-timesheet.component.css"],
})
export class ListTimesheetComponent implements OnInit {
  timesheetList: any;
  userID: string = "";
  searchText: string;
  alertMessage: string = "";
  alertType: string = "";
  todayDate: Date = new Date();

  isAdmin = "";
  isLoading = false;
  isLoaded = false;

  constructor(
    private _employeeService: EmployeeService,
    private _authService: AuthService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._authService.isAdmin();
    if (this.isAdmin == "true") {
      this.userID = this.route.snapshot.paramMap.get("id");
    } else {
      this.userID = this._authService.getUserDetail().id;
    }
    this.refreshTimesheetList();
  }

  deleteTimesheetDialog(timesheet_id: number, tasksheet_id: number) {
    const deleteDialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        title: "Delete Your Task",
        message: "Are you sure you want to delete this Task ?",
        timesheet_id: timesheet_id,
        tasksheet_id: tasksheet_id,
        callingFrom: "deleteSingleTask",
      },
    });
    deleteDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshTimesheetList();
        this.alertType = "success";
        this.alertMessage = "Task Deleted Successfully!";
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

  public editRequestDialog(timesheet_id:number) {
    const deleteDialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        title: "Edit Request To Admin",
        message: "Are you sure you want to edit this Task ?",
        timesheet_id : timesheet_id,
        callingFrom: "editReqAdmin",
      },
    });
    deleteDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshTimesheetList();
        this.alertType = "success";
        this.alertMessage = "Task Edit Request Send Successfully!";
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
  
  addTimesheetDialog() {
    const timesheetDialogRef = this.dialog.open(AddTimesheetComponent, {
      data: {
        matDialogTitle: "Add New Timesheet",
        mode: "add",
      },
      width: "90%",
      height: "90%",
      panelClass: "add-new-timesheet-dialog",
    });
    timesheetDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshTimesheetList();
        this.alertType = "success";
        this.alertMessage = "Timesheet Added Successfully!";
        setTimeout(() => {
          this.alertMessage = "";
        }, 3000);
      }
    });
  }

  allEditTimesheetDialog(timesheet_id: number, timesheetData) {
    const timesheetDialogRef = this.dialog.open(AddTimesheetComponent, {
      data: {
        matDialogTitle: "Edit Timesheet",
        mode: "all-edit",
        id : timesheet_id,
        timesheetData: timesheetData,
      },
      width: "90%",
      height: "90%",
      panelClass: "edit-new-timesheet-dialog",
    });
    timesheetDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshTimesheetList();
        this.alertType = "success";
        this.alertMessage = "Timesheet Added Successfully!";
        setTimeout(() => {
          this.alertMessage = "";
        }, 3000);
      }
    });
  }

  addSingleTasks(id:number ,timesheetData) {
    const timesheetDialogRef = this.dialog.open(TimesheetUpdateComponent, {
      data: {
        matDialogTitle: "Add New Task to timesheet",
        mode: "single-Task-add",
        id :id,
        timesheetData: timesheetData,
      },
      width: "90%",
      height: "90%",
      panelClass: "add-new-timesheet-dialog",
    });
    timesheetDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshTimesheetList();
        this.alertType = "success";
        this.alertMessage = "New Task Added Successfully!";
        setTimeout(() => {
          this.alertMessage = "";
        }, 3000);
      }
    });
  }
  
  updateTimesheetDialog(timesheetData, taskID) {
    const timesheetDialogRef = this.dialog.open(TimesheetUpdateComponent, {
      data: {
        matDialogTitle: "Update Timesheet",
        timesheetData: timesheetData,
        taskID: taskID,
        mode: "edit",
      },
      width: "90%",
      height: "90%",
      panelClass: "update-timesheet-dialog",
    });
    timesheetDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshTimesheetList();
        this.alertType = "success";
        this.alertMessage = "Timesheet Details Updated Successfully!";
        setTimeout(() => {
          this.alertMessage = "";
        }, 3000);
      }
    });
  }

  updateSingleTaskDialog(timesheetData, taskID) {
    const timesheetDialogRef = this.dialog.open(TimesheetUpdateComponent, {
      data: {
        matDialogTitle: "Update Timesheet",
        timesheetData: timesheetData,
        taskID: taskID,
        mode: "single-edit",
      },
      width: "90%",
      height: "90%",
      panelClass: "update-timesheet-dialog",
    });
    timesheetDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshTimesheetList();
        this.alertType = "success";
        this.alertMessage = "Timesheet Details Updated Successfully!";
        setTimeout(() => {
          this.alertMessage = "";
        }, 3000);
      }
    });
  }

  onSearch() {
    // this.refreshTimesheetList(this.searchText);
  }

  refreshTimesheetList() {
    if (!this.isLoaded) {
      this.isLoading = true;
      this.isLoaded = true;
    }
    console.log(this.userID, "userID");
    this._employeeService.getTimesheet(this.userID).subscribe(
      (res) => {
        this.timesheetList = res.result;
        if (this.isLoaded) {
          this.isLoading = false;
          this.isLoaded = false;
        }
        console.log(this.timesheetList, "timesheetList", res);
      },
      (err) => {
        if (this.isLoaded) {
          this.isLoading = false;
          this.isLoaded = false;
        }
        console.log(err, "error");
      }
    );
  }
}
