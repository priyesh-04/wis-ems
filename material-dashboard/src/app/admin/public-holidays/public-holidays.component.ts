import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";

import { pagination, params } from '../../commonModels';
import { MesgageService } from '../../services/shared/message.service';
import { HolidaysService } from '../../services/holidays/holidays.service';
import { ConfirmDeleteComponent } from "../../basic/confirm-delete/confirm-delete.component";
import { PublicHolidaysFormComponent } from '../public-holidays-form/public-holidays-form.component';

@Component({
  selector: 'app-public-holidays',
  templateUrl: './public-holidays.component.html'
})
export class PublicHolidaysComponent implements OnInit {
  private params: params;
  public holidayList = [];
  public pagination: pagination;
  public limit = 10;
  public isLoading = false;
  public currentPage = 1;
  public totalPage = 0;

  constructor(
    private _mesgageService: MesgageService,
    private _holidaysService: HolidaysService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.params = {
      limit: this.limit,
      page: 1
    };
    this.refreshHolidaysList();
  }

  private refreshHolidaysList() {
    this.isLoading = !this.isLoading;
    this._holidaysService.getHolidaysList(this.params).subscribe(
      (res) => {
    this.isLoading = !this.isLoading;
        this.holidayList = res.result;
        this.pagination = res.pagination;
      },
      (err) => {
    this.isLoading = !this.isLoading;
        this._mesgageService.showError(err.error.message || 'Unable to fetch holiday list');        
      }
    );
  }

  public addHolidayDialog() {
    const publicHolidaysRef = this.dialog.open(PublicHolidaysFormComponent, {
      data: {
        matDialogTitle: "Add New Holiday",
        mode: "add",
      },
      width: "90%",
      height: "auto",
      panelClass: "add-holiday-dialog",
    });
    publicHolidaysRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshHolidaysList();
      }
    });
  }

  public updateHolidayDialog(holiday) {
    const publicHolidaysRef = this.dialog.open(PublicHolidaysFormComponent, {
      data: {
        matDialogTitle: "Update Holiday",
        holidayData:holiday,
        mode: "edit",
      },
      width: "90%",
      height: "auto",
      panelClass: "update-holiday-dialog",
    });
    publicHolidaysRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshHolidaysList();
      }
    });
  }

  public deleteHolidayDialog(id) {
    const deleteDialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        title: "Delete Holiday",
        message: "Are you sure you want to delete this Holiday?",
        id,
        callingFrom: "holiday",
      },
    });

    deleteDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshHolidaysList();
      }
    });
  }

  public onPaginationChange(event: params) {
    this.params = event;
    this.limit = this.params.limit;
    this.refreshHolidaysList();
  }
}
