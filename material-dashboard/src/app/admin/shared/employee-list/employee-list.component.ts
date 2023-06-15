import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList, } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  @ViewChildren("pageList") pages: QueryList<ElementRef<HTMLLIElement>>;
  employeeList: any;
  searchText: string;
  alertMessage: string = "";
  alertType: string = "";

  constructor(
    // private _employeeService: EmployeeService,
    public dialog: MatDialog,
    private elRef: ElementRef
    ) { }

    ngOnInit(): void {
      this.refreshEmployeeList();
    }
    addEmployeeDialog() {
      // const employeeDialogRef = this.dialog.open(EmployeeFormComponent, {
      //   data: {
      //     matDialogTitle: "Add New Employee",
      //     mode: "add",
      //     role: "employee",
      //   },
      //   width: "90%",
      //   height: "90%",
      //   panelClass: "add-new-employee-dialog",
      // });
      // employeeDialogRef.afterClosed().subscribe((result) => {
      //   console.log(`Dialog result: ${result}`);
      //   if (result === "success") {
      //     this.refreshEmployeeList();
      //     this.alertType = "success";
      //     this.alertMessage = "Employee Added Successfully!";
      //     setTimeout(() => {
      //       this.alertMessage = "";
      //     }, 3000);
      //   }
      //   // else if (result.error) {
      //   //   this.alertType = "danger";
      //   //   this.alertMessage = result.error.message;
      //   //   setTimeout(() => {
      //   //     this.alertMessage = "";
      //   //   }, 3000);
      //   // }
      // });
    }
  
    updateEmployeeDialog(employeeData) {
      // const employeeDialogRef = this.dialog.open(EmployeeFormComponent, {
      //   data: {
      //     matDialogTitle: "Update Employee",
      //     employeeData: employeeData,
      //     mode: "edit",
      //   },
      //   width: "90%",
      //   height: "90%",
      //   panelClass: "update-employee-dialog",
      // });
      // employeeDialogRef.afterClosed().subscribe((result) => {
      //   console.log(`Dialog result: ${result}`);
      //   if (result === "success") {
      //     this.refreshEmployeeList();
      //     this.alertType = "success";
      //     this.alertMessage = "Employee Details Updated Successfully!";
      //     setTimeout(() => {
      //       this.alertMessage = "";
      //     }, 3000);
      //   }
      // });
    }

    onSearch() {
      this.refreshEmployeeList(this.searchText);
    }
  
    refreshEmployeeList(searchText?: string) {
      // this._employeeService.getAllEmployees().subscribe(
      //   (res) => {
      //     this.employeeList = res.result;
      //     console.log(this.employeeList, "employeeList");
      //   },
      //   (err) => {
      //     console.log(err, "error");
      //   }
      // );
    }

}
