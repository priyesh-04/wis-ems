import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";

import { EmployeeService } from '../../services/employee/employee.service';
import { ConfirmDeleteComponent } from '../../basic/confirm-delete/confirm-delete.component';
import { MesgageService } from '../../services/shared/message.service';
import { EditStatus } from '../../timesheet/utils/TimesheetConstants';
import { pagination, params } from '../../commonModels';

@Component({
  selector: 'app-task-request',
  templateUrl: './task-request.component.html'
})
export class TaskRequestComponent implements OnInit {
  private params: params;
  public allEditReqList = [];
  public EditStatus = EditStatus;
  public pagination: pagination;
  public limit = 10;
  public isLoading = false;
  public currentPage = 1;
  public totalPage = 0;

  constructor(
    private _allEditReqAdmin :EmployeeService,
    private _mesgageService: MesgageService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.params = {
      limit: this.limit,
      page: 1
    };
    this.getAllEditReqAdmin();
  }

  private getAllEditReqAdmin(){
    this.isLoading = !this.isLoading;
    this._allEditReqAdmin.allEditReqAdmin(this.params).subscribe(
      (res) => {
        this.isLoading = !this.isLoading;
        this.allEditReqList = res.result;
        this.pagination = res.pagination;
      },
      (err) => {
        this.isLoading = !this.isLoading;
        this._mesgageService.showError(err.error.message || 'Unable to fetch timesheet request list');
      }
    );
  }

  public approveDialog(id:number) {
    const deleteDialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        title: "Requested Task",
        message: "Are you sure you want to Edit the Approve this Task?",
        timesheet_id: id,
        callingFrom: "reqTaskApprove",
      },
    });

    deleteDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.getAllEditReqAdmin();
      }
    });
  }

  public rejectDialog(id:number) {
    const deleteDialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        title: "Requested Task",
        message: "Are you sure you want to Reject the Task Edit Request?",
        timesheet_id: id,
        callingFrom: "reqTaskReject",
      },
    });

    deleteDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.getAllEditReqAdmin();
      }
    });
  }

  public onPaginationChange(event: params) {
    this.params = event;
    this.limit = this.params.limit;
    this.getAllEditReqAdmin();
  }
}
