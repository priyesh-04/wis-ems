import {
  Component,
  ElementRef,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { EmployeeFormComponent } from "../employee-form/employee-form.component";

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html"
})
export class EmployeeListComponent {
  @ViewChildren("pageList") pages: QueryList<ElementRef<HTMLLIElement>>;  
  public refreshTable = false;

  constructor(
    private dialog: MatDialog,
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
        setTimeout(() => {
          this.refreshTable = false;
        }, 3000);
      }
    });
  }
}
