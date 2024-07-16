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
    this.setCalenderValue(this.timesheetList);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['timesheetList'].currentValue !== changes['timesheetList'].previousValue) { 
      this.setCalenderValue(changes['timesheetList'].currentValue);
    }
  }

  private setCalenderValue(timesheetList) {
    this.monthEvents = [];
    this.weekEvents = [];
    this.dayEvents = [];
    timesheetList.forEach(list => {
      if (list.status === 'Leave') {
        this.monthEvents.push(this.setLeaveEventDetails(list.leaveData, list.date.split('T')[0], 'month'));
        this.weekEvents.push(this.setLeaveEventDetails(list.leaveData, list.date.split('T')[0], 'week'));
        this.dayEvents.push(this.setLeaveEventDetails(list.leaveData, list.date.split('T')[0], 'day'));
      } else {
        if (list.status === 'Half Day') {   
          this.monthEvents.push(this.setLeaveEventDetails(list.leaveData, list.date.split('T')[0], 'month', true));
          this.weekEvents.push(this.setLeaveEventDetails(list.leaveData, list.date.split('T')[0], 'week', true));
          this.dayEvents.push(this.setLeaveEventDetails(list.leaveData, list.date.split('T')[0], 'day', true));
        }
        list.task_details.forEach(task => {
          this.monthEvents.push(this.setTaskEventDetails(task, 'month'));
          this.weekEvents.push(this.setTaskEventDetails(task, 'week'));
          this.dayEvents.push(this.setTaskEventDetails(task, 'day'));
        });
      }
    });
  }

  private setLeaveEventDetails(leaveData, date, eventType: string, isHalfDay = false) {
    const event = {
      html: isHalfDay ? `<strong>${leaveData.type} (Half Day)</strong><br/> ${leaveData.reason}` : `<strong>${leaveData.type}</strong><br/>${formatDate(new Date(date + 'T03:30:00.000Z'), 'hh:mm a', this.locale)} - ${formatDate(new Date(date + 'T15:30:00.000Z'), 'hh:mm a', this.locale)}<br/> ${leaveData.reason}`,
      id: null,
      text: isHalfDay ? 'Half Day' : leaveData.type === 'COMPENSATORY CASUAL LEAVE' ? 'C. CASUAL LEAVE' : leaveData.type,
      start: new DayPilot.Date(date + 'T09:00:00.000Z'),
      end: new DayPilot.Date(date + 'T21:00:00.000Z'),
      backColor: isHalfDay ? '#9FA6B2' : '#54B4D3',
      tags: isHalfDay ? [leaveData.type + '\r\n' + leaveData.reason, eventType, leaveData] : ['(' + formatDate(new Date(date + 'T03:30:00.000Z'), 'hh:mm a', this.locale) + ' - ' + formatDate(new Date(date + 'T15:30:00.000Z'), 'hh:mm a', this.locale) + ')\r\n' + leaveData.reason, eventType, leaveData],
    };
    if (eventType === 'month') {
      delete event.html;
    } else if(eventType === 'day') {
      event.text = null;
    }
    return event;
  }

  private setTaskEventDetails(task, eventType: string) {
    const event = {
      html: `<strong>${task.client.client_name}</strong><br/>${formatDate(new Date(task.start_time), 'hh:mm a', this.locale)} - ${formatDate(new Date(task.end_time), 'hh:mm a', this.locale)}<br/> ${task.description}`,
      id: task._id,
      text: task.client.client_name,
      start: new DayPilot.Date(task.start_time).addHours(5.5),
      end: new DayPilot.Date(task.end_time).addHours(5.5),
      backColor: '#f77b72',
      tags: ['(' + formatDate(new Date(task.start_time), 'hh:mm a', this.locale) + ' - ' + formatDate(new Date(task.end_time), 'hh:mm a', this.locale) + ')\r\n' + task.description, eventType, task],
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
