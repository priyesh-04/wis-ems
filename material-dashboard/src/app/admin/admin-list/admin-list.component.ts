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

@Component({
  selector: "app-admin-list",
  templateUrl: "./admin-list.component.html",
  styleUrls: ["./admin-list.component.css"],
})
export class AdminListComponent implements OnInit {
  @ViewChildren("pageList") pages: QueryList<ElementRef<HTMLLIElement>>;
  adminList: any;
  searchText: string;
  alertMessage: string = "";
  alertType: string = "";

  constructor(
    private _employeeService: EmployeeService,
    public dialog: MatDialog,
    private elRef: ElementRef
  ) {}

  addAdminDialog() {
    const adminDialogRef = this.dialog.open(EmployeeFormComponent, {
      data: {
        matDialogTitle: "Add New Admin",
        mode: "add",
        role: "admin",
      },
      width: "90%",
      height: "90%",
      panelClass: "add-new-admin-dialog",
    });
    adminDialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result === "success") {
        this.refreshadminList();
        this.alertType = "success";
        this.alertMessage = "Admin Added Successfully!";
        setTimeout(() => {
          this.alertMessage = "";
        }, 3000);
      }
    });
  }

  updateAdminDialog(adminData) {
    const adminDialogRef = this.dialog.open(EmployeeFormComponent, {
      data: {
        matDialogTitle: "Update Admin Details",
        employeeData: adminData,
        mode: "edit",
      },
      width: "90%",
      height: "90%",
      panelClass: "update-admin-dialog",
    });
    adminDialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result === "success") {
        this.refreshadminList();
        this.alertType = "success";
        this.alertMessage = "Admin Details Updated Successfully!";
        setTimeout(() => {
          this.alertMessage = "";
        }, 3000);
      }
    });
  }

  ngOnInit(): void {
    this.refreshadminList();
  }

  onSearch() {
    this.refreshadminList(this.searchText);
  }

  refreshadminList(searchText?: string) {
    this._employeeService.getAllAdmins().subscribe(
      (res) => {
        this.adminList = res.result;
      },
      (err) => {
        console.log(err, "error");
      }
    );
  }
}
