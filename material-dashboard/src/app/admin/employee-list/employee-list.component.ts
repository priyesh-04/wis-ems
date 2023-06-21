import {
  Component,
  ElementRef,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { EmployeeFormComponent } from "../employee-form/employee-form.component";
import { messageModel } from "../../components/employee-table/employee-table.component";

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.css"],
})
export class EmployeeListComponent {
  @ViewChildren("pageList") pages: QueryList<ElementRef<HTMLLIElement>>;
  
  public searchText: string;
  public alertMessage: string;
  public alertType: string;
  public refreshTable = false;

  constructor(
    public dialog: MatDialog,
  ) {}

  public addEmployeeDialog() {
    const employeeDialogRef = this.dialog.open(EmployeeFormComponent, {
      data: {
        matDialogTitle: "Add New Employee",
        mode: "add",
        role: "employee",
      },
      width: "90%",
      height: "90%",
      panelClass: "add-new-employee-dialog",
    });
    employeeDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshTable = true;
        this.alertType = "success";
        this.alertMessage = "Employee Added Successfully!";
        setTimeout(() => {
          this.alertMessage = "";
          this.refreshTable = false;
        }, 3000);
      }
    });
  }

  public updateDialog($event: messageModel) {
    this.alertType = $event.alertType;
    this.alertMessage = $event.alertMessage;
    setTimeout(() => {
      this.alertMessage = "";
    }, 3000);
  }

  public onSearch() {}
}
