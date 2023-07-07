import {
  Component,
  OnInit,
  ElementRef,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { EmployeeFormComponent } from "../employee-form/employee-form.component";
import { EmployeeService } from "../../services/employee/employee.service";
import { MesgageService } from "../../services/shared/message.service";

@Component({
  selector: "app-admin-list",
  templateUrl: "./admin-list.component.html"
})
export class AdminListComponent implements OnInit {
  @ViewChildren("pageList") pages: QueryList<ElementRef<HTMLLIElement>>;
  public adminList: any;

  constructor(
    private _employeeService: EmployeeService,
    private _mesgageService: MesgageService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.refreshadminList();
  }

  private refreshadminList() {
    this._employeeService.getAllAdmins().subscribe(
      (res) => {
        this.adminList = res.result;
      },
      (err) => {
        this._mesgageService.showError(err.error.message);
      }
    );
  }

  public addAdminDialog() {
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
      if (result === "success") {
        this.refreshadminList();
      }
    });
  }

  public updateAdminDialog(adminData) {
    const adminDialogRef = this.dialog.open(EmployeeFormComponent, {
      data: {
        matDialogTitle: "Update Admin Details",
        employeeData: adminData,
        mode: "edit",
        role: "admin"
      },
      width: "90%",
      height: "90%",
      panelClass: "update-admin-dialog",
    });
    adminDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshadminList();
      }
    });
  }
}
