import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  DayPilot,
  DayPilotCalendarComponent,
  DayPilotMonthComponent,
  DayPilotNavigatorComponent
} from "@daypilot/daypilot-lite-angular";

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit {
  @Input() timesheetList;
  @ViewChild("day") day!: DayPilotCalendarComponent;
  @ViewChild("week") week!: DayPilotCalendarComponent;
  @ViewChild("month") month!: DayPilotMonthComponent;
  @ViewChild("navigator") nav!: DayPilotNavigatorComponent;
  public date = DayPilot.Date.today();
  public configNavigator: DayPilot.NavigatorConfig = {
    showMonths: 1,
    cellWidth: 25,
    cellHeight: 25,
  };
  public configDay: DayPilot.CalendarConfig = {
    durationBarVisible: false,
    onEventClick: this.onEventClick.bind(this),
  };
  public configWeek: DayPilot.CalendarConfig = {
    viewType: "Week",
    durationBarVisible: false,
    onEventClick: this.onEventClick.bind(this),
  };
  public configMonth: DayPilot.MonthConfig = {
    eventBarVisible: false,
    onEventClick: this.onEventClick.bind(this),
  };
  public events: DayPilot.EventData[] = [];
  private randomColors = ['#f56e64', '#db6b63', '#fa9a93', '#f57369', '#b55750']

  constructor() {
    this.viewType('Month');
  }

  ngOnInit() {
    this.timesheetList.forEach(list => {
      list.task_details.forEach(task => {
        const random = Math.floor(Math.random() * this.randomColors.length);
        this.events.push({
          id: task._id,
          text: task.client.client_name,
          start: new DayPilot.Date(task.start_time).addHours(5.5),
          end: new DayPilot.Date(task.end_time).addHours(5.5),
          backColor: '#f77b72',
        });
      });
    });
  }

  changeDate(date: DayPilot.Date): void {
    this.configDay.startDate = date;
    this.configWeek.startDate = date;
    this.configMonth.startDate = date;
  }

  viewType(type: 'Day' | 'Week' | 'Month' | 'None') {
    this.configNavigator.selectMode = type;
    this.configDay.visible = type === 'Day' ? true : false;
    this.configWeek.visible = type === 'Week' ? true : false;
    this.configMonth.visible = type === 'Month' ? true : false;
  }

  async onEventClick(args: any) {
    console.log('data: ', args.e.data);
  }
}
