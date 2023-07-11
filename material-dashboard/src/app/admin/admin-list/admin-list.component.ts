import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { EmployeeFormComponent } from "../employee-form/employee-form.component";
import { EmployeeService } from "../../services/employee/employee.service";
import { MesgageService } from "../../services/shared/message.service";
import { pagination, params } from "../../commonModels";

@Component({
  selector: "app-admin-list",
  templateUrl: "./admin-list.component.html"
})
export class AdminListComponent implements OnInit {
  private params: params;
  public adminList: any;
  public pagination: pagination;
  public limit = 10;

  constructor(
    private _employeeService: EmployeeService,
    private _mesgageService: MesgageService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.params = {
      limit: this.limit,
      page: 1
    };
    this.refreshadminList();
  }

  private refreshadminList() {
    this._employeeService.getAllAdmins(this.params).subscribe(
      (res) => {
        this.adminList = res.result;
        this.pagination = res.pagination;
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

  public onPaginationChange(event: params) {
    this.params = event;
    this.limit = this.params.limit;
    this.refreshadminList();
  }
}
