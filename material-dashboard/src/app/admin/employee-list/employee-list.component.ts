import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { EmployeeFormComponent } from "../employee-form/employee-form.component";
import { EmployeeService } from "app/services/employee/employee.service";
import { ConfirmDeleteComponent } from "app/basic/confirm-delete/confirm-delete.component";

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.css"],
})
export class EmployeeListComponent implements OnInit {
  @ViewChildren("pageList") pages: QueryList<ElementRef<HTMLLIElement>>;
  employeeList: any;
  searchText: string;
  alertMessage: string = "";
  alertType: string = "";

  constructor(
    private _employeeService: EmployeeService,
    public dialog: MatDialog,
    private elRef: ElementRef
  ) {}

  confirmDeleteDialog(id: number): void {
    const deleteDialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        title: "Delete Employee",
        message: "Are you sure you want to delete this employee?",
        id: id,
      },
    });

    deleteDialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result === "success") {
        this.refreshEmployeeList();
        this.alertType = "success";
        this.alertMessage = "Employee Deleted Successfully!";
        setTimeout(() => {
          this.alertMessage = "";
        }, 3000);
      }
    });
  }

  addEmployeeDialog() {
    const employeeDialogRef = this.dialog.open(EmployeeFormComponent, {
      data: {
        matDialogTitle: "Add New Employee",
        mode: "add",
      },
      width: "90%",
      height: "90%",
      panelClass: "add-new-employee-dialog",
    });
    employeeDialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result === "success") {
        this.refreshEmployeeList();
        this.alertType = "success";
        this.alertMessage = "Employee Added Successfully!";
        setTimeout(() => {
          this.alertMessage = "";
        }, 3000);
      }
    });
  }

  updateEmployeeDialog(employeeData) {
    const employeeDialogRef = this.dialog.open(EmployeeFormComponent, {
      data: {
        matDialogTitle: "Update Employee",
        employeeData: employeeData,
        mode: "edit",
      },
      width: "90%",
      height: "90%",
      panelClass: "update-employee-dialog",
    });
    employeeDialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result === "success") {
        this.refreshEmployeeList();
        this.alertType = "success";
        this.alertMessage = "Employee Details Updated Successfully!";
        setTimeout(() => {
          this.alertMessage = "";
        }, 3000);
      }
    });
  }

  ngOnInit(): void {
    this.refreshEmployeeList();
  }

  onSearch() {
    this.refreshEmployeeList(this.searchText);
  }

  refreshEmployeeList(searchText?: string) {
    this._employeeService.getAllEmployees().subscribe(
      (res) => {
        this.employeeList = res.result;
      },
      (err) => {
        console.log(err, "error");
      }
    );
  }
}
