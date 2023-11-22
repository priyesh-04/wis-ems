import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

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
    this.isLoading = !this.isLoading;
    this._employeeService.getAllEmployeeWithoutPagination().subscribe(
      (res) => {
        this.isLoading = !this.isLoading;
        this.allEmployeeList = res.result;
       // this.employeeList = res.result;
        this.activeEmployeeList = res.result.filter(element => element.is_active === true
          );
          this.inActiveEmployeeList = res.result.filter(element => element.is_active === false
            );
            this.employeeList = this.activeEmployeeList;
        //this.pagination = res.pagination;
        //this.totalPage = res.pagination.total_page
      },
      (err) => {
        this.isLoading = !this.isLoading;
        this._mesgageService.showError(err.error.message || 'Unable to fetch employee list');
      }
    );
  }

  private employeeSpendTimeList() {
    this.isLoading = !this.isLoading;
    this._employeeService.getAllEmployeeSpendTimeWithoutPagination().subscribe(
      (res) => {
        this.isLoading = !this.isLoading;
        this.allEmployeeList = res.result;
        this.activeEmployeeList = res.result.filter(element => element.is_active === true
          );
          this.inActiveEmployeeList = res.result.filter(element => element.is_active === false
            );
        this.employeeList = this.activeEmployeeList;
        //this.pagination = res.pagination;
        //this.totalPage = res.pagination.total_page
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
        this.refreshEmployeeList();
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
        //this.employeeList = res.result;
        this.isActive = true;
        this.employeeList = [];
        this.employeeList = this.allEmployeeList.filter(element => element.is_active === true
         );
  }

  public fetchInActiveUser(){
       this.isActive = false;
       this.employeeList = [];
       this.employeeList = this.allEmployeeList.filter(element => element.is_active === false
      );
  }

}
