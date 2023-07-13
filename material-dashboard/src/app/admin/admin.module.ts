import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MatStepperModule } from "@angular/material/stepper";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";

import { EmployeeListComponent } from "./employee-list/employee-list.component";
import { AdminListComponent } from "./admin-list/admin-list.component";
import { DesignationListComponent } from "./designation-list/designation-list.component";
import { DesignationFormComponent } from "./designation-form/designation-form.component";
import { EmployeeFormComponent } from "./employee-form/employee-form.component";
import { ClientListComponent } from "./client-list/client-list.component";
import { ClientFormComponent } from "./client-form/client-form.component";
import { TaskRequestComponent } from './task-request/task-request.component';
import { ComponentsModule } from "../components/components.module";
import { PublicHolidaysComponent } from './public-holidays/public-holidays.component';
import { PublicHolidaysFormComponent } from './public-holidays-form/public-holidays-form.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatCheckboxModule,
    MatIconModule,
    ComponentsModule
  ],
  declarations: [
    EmployeeListComponent,
    AdminListComponent,
    EmployeeFormComponent,
    DesignationListComponent,
    DesignationFormComponent,
    ClientListComponent,
    ClientFormComponent,
    TaskRequestComponent,
    PublicHolidaysComponent,
    PublicHolidaysFormComponent,
  ],
  exports: [
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatCheckboxModule,
    MatIconModule,
    EmployeeListComponent
  ],
})
export class AdminViewModule {}
