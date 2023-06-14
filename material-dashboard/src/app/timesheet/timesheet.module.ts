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
import { TimesheetListComponent } from "./timesheet-list/timesheet-list.component";
import { AddTimesheetComponent } from "./add-timesheet/add-timesheet.component";
import { ListTimesheetComponent } from "./list-timesheet/list-timesheet.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TimesheetUpdateComponent } from './timesheet-update/timesheet-update.component';

@NgModule({
  declarations: [
    TimesheetListComponent,
    AddTimesheetComponent,
    ListTimesheetComponent,
    TimesheetUpdateComponent,
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
  ],
})
export class TimesheetModule {}
