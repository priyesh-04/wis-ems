import { formatDate } from '@angular/common';
import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
  @Output() onDateRangePicked = new EventEmitter<string>();
  @ViewChild("day") day!: DayPilotCalendarComponent;
  @ViewChild("week") week!: DayPilotCalendarComponent;
  @ViewChild("month") month!: DayPilotMonthComponent;
  @ViewChild("navigator") nav!: DayPilotNavigatorComponent;
  public date = DayPilot.Date.today();
  public configNavigator: DayPilot.NavigatorConfig = {
    showMonths: 1,
    cellWidth: 25,
    cellHeight: 25,
    onVisibleRangeChanged: args => {
      this.loadEvents();
    }
  };
  public configDay: DayPilot.CalendarConfig = {
    durationBarVisible: false,
    onBeforeEventRender: this.onBeforeEventRender.bind(this),
  };
  public configWeek: DayPilot.CalendarConfig = {
    viewType: "Week",
    durationBarVisible: false,
    onBeforeEventRender: this.onBeforeEventRender.bind(this),
  };
  public configMonth: DayPilot.MonthConfig = {
    eventBarVisible: false,
    onBeforeEventRender: this.onBeforeEventRender.bind(this),
  };
  public monthEvents: DayPilot.EventData[] = [];
  public weekEvents: DayPilot.EventData[] = [];
  public dayEvents: DayPilot.EventData[] = [];
  private startDate;

  constructor(@Inject(LOCALE_ID) public locale: string) {
    this.viewType('Month');
  }

  ngOnInit() {
    this.monthEvents = [];
    this.weekEvents = [];
    this.dayEvents = [];
    this.timesheetList.forEach(list => {
      list.task_details.forEach(task => {
        this.monthEvents.push(this.setEventDetails(task, 'month'));
        this.weekEvents.push(this.setEventDetails(task, 'week'));
        this.dayEvents.push(this.setEventDetails(task, 'day'));
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['timesheetList'].currentValue !== changes['timesheetList'].previousValue) {      
      console.log('timesheetList: ', this.timesheetList);
      this.monthEvents = [];
      this.weekEvents = [];
      this.dayEvents = [];
      changes['timesheetList'].currentValue.forEach(list => {
        list.task_details.forEach(task => {
          this.monthEvents.push(this.setEventDetails(task, 'month'));
          this.weekEvents.push(this.setEventDetails(task, 'week'));
          this.dayEvents.push(this.setEventDetails(task, 'day'));
        });
      });
    }
  }

  private setEventDetails(task, eventType: string) {
    const event = {
      html: `<strong>${task.client.client_name}</strong><br/>${formatDate(new Date(task.start_time), 'hh:mm a', this.locale)} - ${formatDate(new Date(task.end_time), 'hh:mm a', this.locale)}<br/> ${task.description}`,
      id: task._id,
      text: task.client.client_name,
      start: new DayPilot.Date(task.start_time).addHours(5.5),
      end: new DayPilot.Date(task.end_time).addHours(5.5),
      backColor: '#f77b72',
      tags: ['(' + formatDate(new Date(task.start_time), 'hh:mm a', this.locale) + ' - ' + formatDate(new Date(task.end_time), 'hh:mm a', this.locale) + ') ' + task.description, eventType, task],
    };
    if (eventType === 'month') {
      delete event.html;
    } else if(eventType === 'day') {
      event.text = null;
    }
    return event;
  }

  private loadEvents(): void {
    this.startDate = this.nav.control.visibleStart();
    this.onDateRangePicked.emit(this.startDate.toString());
  }

  private onBeforeEventRender(args: any) {
    args.data.areas = [
      args.data.tags[1] !== 'day' ? {
        top: 0,
        right: 3,
        width: 15,
        height: 15,
        symbol: "assets/img/daypilot.svg#i-circle",
        fontColor: "#fff",
        toolTip: args.data.tags[0],
      } : {},
    ];
  }

  public changeDate(date: DayPilot.Date): void {
    this.configDay.startDate = date;
    this.configWeek.startDate = date;
    this.configMonth.startDate = date;
  }

  public viewType(type: 'Day' | 'Week' | 'Month' | 'None') {
    this.configNavigator.selectMode = type;
    this.configDay.visible = type === 'Day' ? true : false;
    this.configWeek.visible = type === 'Week' ? true : false;
    this.configMonth.visible = type === 'Month' ? true : false;
  }
}
