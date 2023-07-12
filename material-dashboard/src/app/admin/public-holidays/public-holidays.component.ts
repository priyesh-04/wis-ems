import { Component, OnInit } from '@angular/core';

import { pagination, params } from '../../commonModels';
import { MesgageService } from '../../services/shared/message.service';
import { HolidaysService } from '../../services/holidays/holidays.service';

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
        console.log('res: ', res);
        
        this.holidayList = res.result;
      },
      (err) => {
        this._mesgageService.showError(err.error.message || 'Unable to fetch holidays list');        
      }
    );
  }

  public addHolidayDialog() {
  }

  public updateHolidayDialog(holidayData) {
  }

  public deleteHolidayDialog(id) {
  }
}
