import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EmployeeService } from '../../services/employee/employee.service';
import { EmployeeFormComponent } from '../../admin/employee-form/employee-form.component';
import { MesgageService } from '../../services/shared/message.service';

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
  @Output() updateDialog = new EventEmitter<messageModel>();

  public employeeList: any;
  public useDefault :boolean;

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
    if (this.isDashboard) {
      this.employeeSpendTimeList();
    } else {
      this.refreshEmployeeList();
    }
  }
  
  private refreshEmployeeList() {
    this._employeeService.getAllEmployees().subscribe(
      (res) => {
        this.employeeList = res.result;
      },
      (err) => {
        this._mesgageService.showError(err.error.message || 'Unable to fetch employee list');
      }
    );
  }

  private employeeSpendTimeList() {
    this._employeeService.getAllEmployeesSpendTime().subscribe(
      (res) => {
        this.employeeList = res.result;
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

}
