import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { DayPilotModule } from "@daypilot/daypilot-lite-angular";

import { AddTimesheetComponent } from "./add-timesheet/add-timesheet.component";
import { ListTimesheetComponent } from "./list-timesheet/list-timesheet.component";
import { TimesheetUpdateComponent } from './timesheet-update/timesheet-update.component';
import { CalendarViewComponent } from "./calendar-view/calendar-view.component";
import { ComponentsModule } from "../components/components.module";

@NgModule({
  declarations: [
    AddTimesheetComponent,
    ListTimesheetComponent,
    TimesheetUpdateComponent,
    CalendarViewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    CdkAccordionModule,
    DayPilotModule,
    ComponentsModule
  ],
})
export class TimesheetModule {}
