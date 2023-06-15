import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";
import { AfterViewInit,  ElementRef,  ViewChildren,  QueryList,} from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  user: any;
  data: any;
  @ViewChildren("pageList") pages: QueryList<ElementRef<HTMLLIElement>>;
  employeeList: any;
  searchText: string;
  alertMessage: string = "";
  alertType: string = "";

  constructor(public _authService: AuthService, public _router: Router,
    // private _employeeService: EmployeeService
    ) {}

  ngOnInit(): void {
    this.user = this._authService.getLoggedInUser();
    // this.refreshEmployeeList();

  }

  addEmployeeDialog() {
  //   const employeeDialogRef = this.dialog.open(EmployeeFormComponent, {
  //     data: {
  //       matDialogTitle: "Add New Employee",
  //       mode: "add",
  //       role: "employee",
  //     },
  //     width: "90%",
  //     height: "90%",
  //     panelClass: "add-new-employee-dialog",
  //   });
  //   employeeDialogRef.afterClosed().subscribe((result) => {
  //     console.log(`Dialog result: ${result}`);
  //     if (result === "success") {
  //       this.refreshEmployeeList();
  //       this.alertType = "success";
  //       this.alertMessage = "Employee Added Successfully!";
  //       setTimeout(() => {
  //         this.alertMessage = "";
  //       }, 3000);
  //     }
  //     // else if (result.error) {
  //     //   this.alertType = "danger";
  //     //   this.alertMessage = result.error.message;
  //     //   setTimeout(() => {
  //     //     this.alertMessage = "";
  //     //   }, 3000);
  //     // }
  //   });
  }

  // updateEmployeeDialog(employeeData) {
  //   const employeeDialogRef = this.dialog.open(EmployeeFormComponent, {
  //     data: {
  //       matDialogTitle: "Update Employee",
  //       employeeData: employeeData,
  //       mode: "edit",
  //     },
  //     width: "90%",
  //     height: "90%",
  //     panelClass: "update-employee-dialog",
  //   });
  //   employeeDialogRef.afterClosed().subscribe((result) => {
  //     console.log(`Dialog result: ${result}`);
  //     if (result === "success") {
  //       this.refreshEmployeeList();
  //       this.alertType = "success";
  //       this.alertMessage = "Employee Details Updated Successfully!";
  //       setTimeout(() => {
  //         this.alertMessage = "";
  //       }, 3000);
  //     }
  //   });
  // }

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
