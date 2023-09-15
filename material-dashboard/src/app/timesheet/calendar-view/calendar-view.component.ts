import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
export class CalendarViewComponent implements OnInit, OnChanges {
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

  constructor() {
    this.viewType('Month');
  }

  ngOnInit() {
    this.timesheetList.forEach(list => {
      list.task_details.forEach(task => {
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

  ngOnChanges(changes: SimpleChanges) {
    if(changes['timesheetList'].currentValue !== changes['timesheetList'].previousValue) {
      this.events = [];
      changes['timesheetList'].currentValue.forEach(list => {
        list.task_details.forEach(task => {
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
