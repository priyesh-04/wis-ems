import { Routes } from "@angular/router";
import { AuthGuard } from "../../authentication/guards/auth.guard";
import { HomeComponent } from "../../basic/home/home.component";
import { AdminGuard } from "../../authentication/guards/admin.guard";
import { StaffGuard } from "../../authentication/guards/staff.guard";
import { AdminListComponent } from "../../admin/admin-list/admin-list.component";
import { EmployeeListComponent } from "../../admin/employee-list/employee-list.component";
import { TimesheetListComponent } from "../../timesheet/timesheet-list/timesheet-list.component";
import { DesignationListComponent } from "../../admin/designation-list/designation-list.component";
import { ClientListComponent } from "../../admin/client-list/client-list.component";
import { ListTimesheetComponent } from "../../timesheet/list-timesheet/list-timesheet.component";
import { TaskRequestComponent } from "../../admin/task-request/task-request.component";
import { PasswordChangeComponent } from "../../authentication/password-change/password-change.component";
import { UserProfileComponent } from "app/authentication/profile/user-profile/user-profile.component";
// import { EmployeeListComponent } from "app/admin/shared/employee-list-table/employee-list.component";
export const UserRoutes: Routes = [
  // Common Routes
  {
    path: "dashboard",
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path:"profile",
    component:UserProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "change-password",
    component: PasswordChangeComponent,
    canActivate: [AuthGuard],
  },
  // Admin Routes
  {
    path: "dashboard",
    component: EmployeeListComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
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
  {
    path: "admin/task-request",
    component: TaskRequestComponent,
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
