import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { EmployeeService } from "app/services/employee/employee.service";
import { AddTimesheetComponent } from "../add-timesheet/add-timesheet.component";
import { AuthService } from "app/services/auth/auth.service";
import { ActivatedRoute } from "@angular/router";
import { TimesheetUpdateComponent } from "../timesheet-update/timesheet-update.component";

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
    private elRef: ElementRef,
    private route: ActivatedRoute
  ) {}

  deleteTimesheetDialog(timesheetData) {}

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
      console.log(`Dialog result: ${result}`);
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

  addTasksDialog(timesheetData) {
    const timesheetDialogRef = this.dialog.open(TimesheetUpdateComponent, {
      data: {
        matDialogTitle: "Add New Task to timesheet",
        mode: "Task-add",
        timesheetData: timesheetData,
      },
      width: "90%",
      height: "90%",
      panelClass: "add-new-timesheet-dialog",
    });
    timesheetDialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
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
      console.log(`Dialog result: ${result}`);
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

  ngOnInit(): void {
    this.isAdmin = this._authService.isAdmin();
    if (this.isAdmin == "true") {
      this.userID = this.route.snapshot.paramMap.get("id");
    } else {
      this.userID = this._authService.getUserDetail().id;
    }
    this.refreshTimesheetList();
  }

  onSearch() {
    this.refreshTimesheetList(this.searchText);
  }

  refreshTimesheetList(searchText?: string) {
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
