import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

import { EmployeeService } from '../../services/employee/employee.service';
import { EmployeeFormComponent } from '../../admin/employee-form/employee-form.component';
import { MesgageService } from '../../services/shared/message.service';
import { pagination, params } from '../../commonModels';
import { ConfirmDeleteComponent } from "../../basic/confirm-delete/confirm-delete.component";

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
  public allEmployeeList = [];
  public searchTerm : string ='';
  public isActive : boolean =true;
  public employeeList = [];
  public activeEmployeeList = [];
  public inActiveEmployeeList = [];
  public useDefault :boolean;
  public pagination: pagination;
  public limit = 10;
  public isLoading = false;
  public currentPage = 1;
  public totalPage = 0;
  public filterStartDate: string;
  public filterEndDate: string;
  
  constructor(    
    private _employeeService: EmployeeService,
    private _mesgageService: MesgageService,
    private dialog: MatDialog,
    private datepipe: DatePipe,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isDashboard && changes.refreshTable.currentValue) {
      this.refreshEmployeeList();
    }   
  }

  ngOnInit(): void {
    const currentDate = new Date().getDate();
    //NB: Get start date as the 14th of current or next month
    this.filterEndDate = this.datepipe.transform(`${new Date().getFullYear()}-${(currentDate >= 15) ? new Date().getMonth() + 2 : new Date().getMonth() + 1}-14`, 'yyyy-MM-dd');
    //NB: Get start date as the 15th of current or last month
    this.filterStartDate = this.datepipe.transform(`${new Date().getFullYear()}-${(currentDate >= 15) ? new Date().getMonth() + 1 : new Date().getMonth()}-15`, 'yyyy-MM-dd');

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
    this.isLoading = !this.isLoading;
    this._employeeService.getAllEmployeeWithoutPagination().subscribe(
      (res) => {
        this.isLoading = !this.isLoading;
        this.allEmployeeList = res.result;
        this.activeEmployeeList = res.result.filter(element => element.is_active === true
          );
          this.inActiveEmployeeList = res.result.filter(element => element.is_active === false
            );
            this.employeeList = this.activeEmployeeList;
      },
      (err) => {
        this.isLoading = !this.isLoading;
        this._mesgageService.showError(err.error.message || 'Unable to fetch employee list');
      }
    );
  }

  private employeeSpendTimeList() {
    this.isLoading = !this.isLoading;

    const filterStartDate = this.filterStartDate+"T00:00:00+05:30";
    const filterEndDate = this.datepipe.transform(new Date(this.filterEndDate).setDate(new Date(this.filterEndDate).getDate() + 1), 'yyyy-MM-dd')+"T00:00:00+05:30";

    this._employeeService.getAllEmployeeSpendTimeWithoutPagination(filterStartDate, filterEndDate).subscribe(
      (res) => {
        this.isLoading = !this.isLoading;
        this.allEmployeeList = res.result;
        this.activeEmployeeList = res.result.filter(element => element.is_active === true
          );
          this.inActiveEmployeeList = res.result.filter(element => element.is_active === false
            );
        this.employeeList = this.activeEmployeeList;
      },
      (err) => {
        this.isLoading = !this.isLoading;
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

  public employeeToggle(userId, is_active){
    const deleteDialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        message: `Are you sure you want to ${is_active ? 'Deactive' : 'Active'} Employee?`,
        userId :userId,
        callingFrom:'employeeStatus',
        is_active,
        mode:'employeeStatus'
      },
    });
    deleteDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        if (this.isDashboard) {
          this.employeeSpendTimeList();
        } else {
          this.refreshEmployeeList();
        }
      }      
    });
  }

  public onPaginationChange(event: params) {
    this.searchTerm = '';
    this.params = event;
    this.limit = this.params.limit;
    if (this.isDashboard) {
      this.employeeSpendTimeList();
    } else {
      this.refreshEmployeeList();
    }
  }

  public searchByName(event: KeyboardEvent): void {
    if (this.searchTerm.trim() !== '') {
      if(this.isActive){
        this.employeeList = this.activeEmployeeList.filter(employee =>
          employee.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }else{
          this.employeeList = this.inActiveEmployeeList.filter(employee =>
            employee.name.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
      }
    }else{
      this.employeeList = this.allEmployeeList.filter(employee =>
        employee.is_active === this.isActive
      );
    } 
  }

  public fetchActiveUser(){
    this.isActive = true;
    this.employeeList = [];
    this.employeeList = this.allEmployeeList.filter(element => element.is_active === true);
  }

  public fetchInActiveUser(){
    this.isActive = false;
    this.employeeList = [];
    this.employeeList = this.allEmployeeList.filter(element => element.is_active === false);
  }

}
