import { Component, OnInit } from '@angular/core';

import { pagination, params } from '../../commonModels';
import { MesgageService } from '../../services/shared/message.service';
import { HolidaysService } from '../../services/holidays/holidays.service';
import { ConfirmDeleteComponent } from "../../basic/confirm-delete/confirm-delete.component";
import { MatDialog } from "@angular/material/dialog";
import { PublicHolidaysFormComponent } from '../public-holidays-form/public-holidays-form.component';
@Component({
  selector: 'app-public-holidays',
  templateUrl: './public-holidays.component.html',
  styleUrls: ['./public-holidays.component.css']
})
export class PublicHolidaysComponent implements OnInit {
  private params: params;
  public holidayList = [];
  public limit = 10;

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
    this._holidaysService.getHolidaysList(this.params).subscribe(
      (res) => {
        this.holidayList = res.result;
      },
      (err) => {
        this._mesgageService.showError(err.error.message || 'Unable to fetch holidays list');        
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
        // this._mesgageService.showSuccess(result.message)
      }
    });
  }
}
