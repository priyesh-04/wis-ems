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
  private userID = "";
  public isAdmin: boolean;
  public timesheetList = [];
  public employeeList = [];
  public isLoading = false;
  public EditStatus = EditStatus;
  public filterStartDate: string;
  public filterEndDate: string;
  public currentPage = 1;
  public totalPage = 0;
  public expandedIndex = 0;
  public accordionFlag = true;
  public filterProjectList = [];
  public clientid = '';
  public viewType: 'listView' | 'calendarView' = 'listView';
  public totalWorkingDays = 0;

  constructor(
    private _employeeService: EmployeeService,
    private _authService: AuthService,
    private _mesgageService: MesgageService,
    private datepipe: DatePipe,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const currentDate = new Date().getDate();
    //NB: Get start date as the 14th of current or next month
    this.filterEndDate = this.datepipe.transform(`${new Date().getFullYear()}-${(currentDate >= 15) ? new Date().getMonth() + 2 : new Date().getMonth() + 1}-14`, 'yyyy-MM-dd');
    //NB: Get start date as the 15th of current or last month
    this.filterStartDate = this.datepipe.transform(`${new Date().getFullYear()}-${(currentDate >= 15) ? new Date().getMonth() + 1 : new Date().getMonth()}-15`, 'yyyy-MM-dd');
    this.isAdmin = this._authService.isAdmin()  === "true" ? true : false;
    if (this.isAdmin) {
      this.userID = this.route.snapshot.paramMap.get("id");
      this.employeesList();
    } else {
      this.userID = this._authService.getUserDetail().id;
    }
    this.refreshTimesheetList();
    //
    this._authService.getProfile().subscribe(
      (res) => {
        this.filterProjectList = res.result.assigned_client;
      },
      (err) => {
        this._mesgageService.showError(err.error.message || 'Unable to fetch data');
      }
    );
  }

  private refreshTimesheetList(isloadMore = false, startDate?: string, isLoading = true) {
    this.isLoading = isLoading;
    if (!isloadMore) {
      this.currentPage = 1;
    }
    const filterStartDate = startDate ? startDate : (this.viewType === 'listView' ? this.filterStartDate+"T00:00:00+05:30" : this.datepipe.transform(`${new Date().getFullYear()}-${new Date().getMonth()}-25`, 'yyyy-MM-dd')+"T00:00:00+05:30");
    const filterEndDate = (this.viewType === 'listView' ? this.datepipe.transform(new Date(this.filterEndDate).setDate(new Date(this.filterEndDate).getDate() + 1), 'yyyy-MM-dd')+"T00:00:00+05:30" :  this.datepipe.transform(new Date().setDate(new Date().getDate() + 1), 'yyyy-MM-dd')+"T00:00:00+05:30");
    const limit = this.viewType === 'listView' ? 10 : 50;

    this._employeeService.getTimesheet(this.userID, filterStartDate, filterEndDate, this.clientid, this.currentPage, limit).subscribe(
      (res) => {
        this.timesheetList = !isloadMore ? res.result : [...this.timesheetList, ...res.result];
        this.totalPage = res.pagination ? res.pagination.total_page : 0;
        this.totalWorkingDays = res.totalWorkingDays;
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        this._mesgageService.showError(err.error.message || 'Unable to fetch timesheet');
      }
    );
  }

  private employeesList() {
    this._employeeService.getAllEmployees().subscribe(
      (res) => {
        this.employeeList = res.result;
      },
      (err) => {
        this._mesgageService.showError(err.error.message || 'Unable to employee list');
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
        timesheetList: this.timesheetList,
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

  public selectEmployee(event) {
    this.userID = event.value;
    this.refreshTimesheetList();
  }

  public toggleAccordion(){
      this.accordionFlag=!this.accordionFlag;
  }

  public selectProject(event){
    this.clientid = event.value;
    this.refreshTimesheetList();
  }

  public setViewType(viewType: 'listView' | 'calendarView') {
    this.viewType = viewType;
    this.refreshTimesheetList();
  }

  public calenderDateRange(startDate) {
    this.refreshTimesheetList(false, startDate + '+05:30', false);
  }

  public getAccordionBGColor(status: string) {
    switch(status) {
      case 'Present':
        return 'bg-success';
      case 'Leave':
        return 'bg-info';
      case 'Half Day':
        return 'bg-secondary ';
      default:
        return 'bg-danger';
    }
  }
}
