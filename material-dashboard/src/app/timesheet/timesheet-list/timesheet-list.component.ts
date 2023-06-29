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

@Component({
  selector: "app-timesheet-list",
  templateUrl: "./timesheet-list.component.html",
  styleUrls: ["./timesheet-list.component.css"],
})
export class TimesheetListComponent implements OnInit {
  @ViewChildren("pageList") pages: QueryList<ElementRef<HTMLLIElement>>;
  timesheetList: any;
  searchText: string;
  alertMessage: string = "";
  alertType: string = "";

  constructor(
    private _employeeService: EmployeeService,
    public dialog: MatDialog,
    private elRef: ElementRef
  ) {}

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

  updateTimesheetDialog(timesheetData) {
    const timesheetDialogRef = this.dialog.open(AddTimesheetComponent, {
      data: {
        matDialogTitle: "Update Timesheet",
        timesheetData: timesheetData,
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
    this.refreshTimesheetList();
  }

  onSearch() {
    this.refreshTimesheetList(this.searchText);
  }

  refreshTimesheetList(searchText?: string) {
    // this._employeeService.getTimesheet("abc").subscribe(
    //   (res) => {
    //     this.timesheetList = res.result;
    //     console.log(this.timesheetList, "timesheetList");
    //   },
    //   (err) => {
    //     console.log(err, "error");
    //   }
    // );
  }
}
