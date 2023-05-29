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
import { EmployeeListComponent } from "./employee-list/employee-list.component";
import { AdminListComponent } from "./admin-list/admin-list.component";
import { MatIconModule } from "@angular/material/icon";
import { DesignationListComponent } from "./designation-list/designation-list.component";
import { DesignationFormComponent } from "./designation-form/designation-form.component";
import { EmployeeFormComponent } from "./employee-form/employee-form.component";

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
  ],
  declarations: [
    EmployeeListComponent,
    AdminListComponent,
    EmployeeFormComponent,
    DesignationListComponent,
    DesignationFormComponent,
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
  ],
})
export class AdminViewModule {}
