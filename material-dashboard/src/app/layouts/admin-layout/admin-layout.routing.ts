import { Routes } from "@angular/router";
import { AuthGuard } from "../../authentication/guards/auth.guard";
import { HomeComponent } from "../../basic/home/home.component";
import { AdminGuard } from "../../authentication/guards/admin.guard";
import { StaffGuard } from "../../authentication/guards/staff.guard";
import { AdminListComponent } from "../../admin/admin-list/admin-list.component";
import { EmployeeListComponent } from "../../admin/employee-list/employee-list.component";
import { TimesheetListComponent } from "app/timesheet/timesheet-list/timesheet-list.component";
import { DesignationListComponent } from "app/admin/designation-list/designation-list.component";
import { ClientListComponent } from "app/admin/client-list/client-list.component";
import { ListTimesheetComponent } from "../../timesheet/list-timesheet/list-timesheet.component";

export const UserRoutes: Routes = [
  // Common Routes
  {
    path: "home",
    component: HomeComponent,
  },

  // Admin Routes
  {
    path: "admin/admin-list",
    component: AdminListComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "admin/employee-list",
    component: EmployeeListComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "admin/client-list",
    component: ClientListComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: "admin/designation-list",
    component: DesignationListComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  // Hr Routes
  {
    path: "hr/employee-list",
    component: EmployeeListComponent,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: "hr/client-list",
    component: ClientListComponent,
    canActivate: [AuthGuard, StaffGuard],
  },
  {
    path: "hr/designation-list",
    component: DesignationListComponent,
    canActivate: [AuthGuard, StaffGuard],
  },

  // Timesheet Routes
  {
    path: "timesheet-list",
    component: ListTimesheetComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "timesheet-list/:id",
    component: ListTimesheetComponent,
    canActivate: [AuthGuard],
  },
];
