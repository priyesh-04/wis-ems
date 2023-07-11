import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EmployeeService } from '../../services/employee/employee.service';
import { EmployeeFormComponent } from '../../admin/employee-form/employee-form.component';
import { MesgageService } from '../../services/shared/message.service';
import { pagination, params } from '../../commonModels';

export interface messageModel {
  alertType: string;
  alertMessage: string;
}

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html'
})
export class EmployeeTableComponent implements OnChanges, OnInit {
  @Input() isDashboard: boolean;
  @Input() refreshTable?: boolean;

  private params: params;
  public employeeList: any;
  public useDefault :boolean;
  public pagination: pagination;
  public limit = 10;

  constructor(    
    private _employeeService: EmployeeService,
    private _mesgageService: MesgageService,
    private dialog: MatDialog,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isDashboard && changes.refreshTable.currentValue) {
      this.refreshEmployeeList();
    }   
  }

  ngOnInit(): void {
    this.params = {
      limit: this.limit,
      page: 1
    };

    if (this.isDashboard) {
      this.employeeSpendTimeList();
    } else {
      this.refreshEmployeeList();
    }
  }
  
  private refreshEmployeeList() {
    this._employeeService.getAllEmployees(this.params).subscribe(
      (res) => {
        this.employeeList = res.result;
        this.pagination = res.pagination;
      },
      (err) => {
        this._mesgageService.showError(err.error.message || 'Unable to fetch employee list');
      }
    );
  }

  private employeeSpendTimeList() {
    this._employeeService.getAllEmployeesSpendTime(this.params).subscribe(
      (res) => {
        this.employeeList = res.result;
        this.pagination = res.pagination;
      },
      (err) => {
        this._mesgageService.showError(err.error.message || 'Unable to fetch employee list');
      }
    );
  }

  public updateEmployeeDialog(employeeData) {
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
      if (result === "success") {
        this.refreshEmployeeList();
      }
    });
  }

  public onPaginationChange(event: params) {
    this.params = event;
    this.limit = this.params.limit;
    if (this.isDashboard) {
      this.employeeSpendTimeList();
    } else {
      this.refreshEmployeeList();
    }
  }

}
