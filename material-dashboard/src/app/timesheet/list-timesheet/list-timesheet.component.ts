import {
  Component,
  OnInit,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";

import { AddTimesheetComponent } from "../add-timesheet/add-timesheet.component";
import { TimesheetUpdateComponent } from "../timesheet-update/timesheet-update.component";
import { EditStatus, SubmitModes } from "../utils/TimesheetConstants";
import { EmployeeService } from "../../services/employee/employee.service";
import { AuthService } from "../../services/auth/auth.service";
import { ConfirmDeleteComponent } from "../../basic/confirm-delete/confirm-delete.component";
import { MesgageService } from "../../services/shared/message.service";

@Component({
  selector: "app-list-timesheet",
  templateUrl: "./list-timesheet.component.html",
  styleUrls: ["./list-timesheet.component.css"],
})
export class ListTimesheetComponent implements OnInit {
  private userID: string = "";
  public isAdmin = "";
  public timesheetList = [];
  public isLoading = false;
  public EditStatus = EditStatus;
  public filterStartDate: string;
  public filterEndDate: string;
  public currentPage = 1;
  public totalPage = 0;

  constructor(
    private _employeeService: EmployeeService,
    private _authService: AuthService,
    private _mesgageService: MesgageService,
    private datepipe: DatePipe,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.filterEndDate = this.datepipe.transform((new Date), 'yyyy-MM-dd');
    this.filterStartDate = this.datepipe.transform((new Date).setDate((new Date).getDate() - 30), 'yyyy-MM-dd');
    this.isAdmin = this._authService.isAdmin();
    if (this.isAdmin === "true") {
      this.userID = this.route.snapshot.paramMap.get("id");
    } else {
      this.userID = this._authService.getUserDetail().id;
    }
    this.refreshTimesheetList();
  }

  private refreshTimesheetList(isloadMore = false) {
    this.isLoading = !this.isLoading;
    this._employeeService.getTimesheet(this.userID, this.filterStartDate, this.filterEndDate, this.currentPage).subscribe(
      (res) => {
        this.timesheetList = !isloadMore ? res.result : [...this.timesheetList, ...res.result];
        this.totalPage = res.pagination.total_page;
        this.isLoading = !this.isLoading;
      },
      (err) => {
        this.isLoading = !this.isLoading;
        this._mesgageService.showError(err.error.message || 'Unable to fetch timesheet');
      }
    );
  }

  public deleteTimesheetDialog(timesheet_id: number, tasksheet_id: number) {
    const deleteDialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        title: "Delete Your Task",
        message: "Are you sure you want to delete this Task?",
        timesheet_id: timesheet_id,
        tasksheet_id: tasksheet_id,
        callingFrom: "deleteSingleTask",
      },
    });
    deleteDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshTimesheetList();
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
      }
    });
  }
  
  public addTimesheetDialog() {
    const timesheetDialogRef = this.dialog.open(AddTimesheetComponent, {
      data: {
        matDialogTitle: "Add New Timesheet",
        mode: SubmitModes.MultipleAdd,
      },
      width: "90%",
      height: "90%",
      panelClass: "add-new-timesheet-dialog",
    });
    timesheetDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshTimesheetList();
      }
    });
  }

  public allEditTimesheetDialog(timesheet_id: number, timesheetData) {
    const timesheetDialogRef = this.dialog.open(AddTimesheetComponent, {
      data: {
        matDialogTitle: "Edit Timesheet",
        mode: SubmitModes.MultipleEdit,
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
      }
    });
  }

  public addSingleTasks(id:number ,timesheetData) {
    const timesheetDialogRef = this.dialog.open(TimesheetUpdateComponent, {
      data: {
        matDialogTitle: "Add New Task to timesheet",
        mode: SubmitModes.SingleAdd,
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
      }
    });
  }

  public updateSingleTaskDialog(timesheetData, taskID) {
    const timesheetDialogRef = this.dialog.open(TimesheetUpdateComponent, {
      data: {
        matDialogTitle: "Update Timesheet",
        timesheetData: timesheetData,
        taskID: taskID,
        mode: SubmitModes.SingleEdit,
      },
      width: "90%",
      height: "90%",
      panelClass: "update-timesheet-dialog",
    });
    timesheetDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshTimesheetList();
      }
    });
  }

  public loadMore() {
    this.currentPage++;
    this.refreshTimesheetList(true);
  }
}
