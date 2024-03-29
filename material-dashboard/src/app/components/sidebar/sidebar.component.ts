import { Component, OnInit } from "@angular/core";

import { AuthService } from "../../services/auth/auth.service";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const employeeROUTES: RouteInfo[] = [
  { path: "/dashboard", title: "Dashboard", icon: "dashboard", class: "" },
  {
    path: "/timesheet-list",
    title: "Timesheet",
    icon: "article",
    class: "",
  }
];
export const hrROUTES: RouteInfo[] = [
  { path: "/dashboard", title: "Dashboard", icon: "dashboard", class: "" },
  {
    path: "/hr/employee-list",
    title: "Employee List",
    icon: "list",
    class: "",
  },
  {
    path: "/hr/project-list",
    title: "Project List",
    icon: "assignment_turned_in",
    class: "",
  },
  {
    path: "/hr/designation-list",
    title: "Designation List",
    icon: "group_work",
    class: "",
  },
  {
    path: "/timesheet-list",
    title: "Timesheet",
    icon: "article",
    class: "",
  }
];
export const adminROUTES: RouteInfo[] = [
  { path: "/dashboard", title: "Dashboard", icon: "dashboard", class: "" },
  {
    path: "/admin/admin-list",
    title: "Admin List",
    icon: "article",
    class: "",
  },
  {
    path: "/admin/employee-list",
    title: "Employee List",
    icon: "list",
    class: "",
  },
  {
    path: "/admin/project-list",
    title: "Project List",
    icon: "assignment_turned_in",
    class: "",
  },
  {
    path: "/admin/designation-list",
    title: "Designation List",
    icon: "group_work",
    class: "",
  },
  {
    path: "/admin/task-request",
    title: "Task Request",
    icon: "work",
    class: "",
  },
  {
    path: "/admin/office-holidays",
    title: "Office Holidays",
    icon: "date_range",
    class: "",
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html"
})
export class SidebarComponent implements OnInit {
  public menuItems = [];

  constructor(private _authService: AuthService) {}

  ngOnInit() {
    const user = this._authService.getUserDetail();
    if (user) {
      if (user.role === "admin") {
        this.menuItems = adminROUTES.filter((listTitle) => listTitle);
      } else if (user.role === "hr") {
        this.menuItems = hrROUTES.filter((listTitle) => listTitle);
      } else if (user.role === "employee") {
        this.menuItems = employeeROUTES.filter((listTitle) => listTitle);
      }
    }
  }
}
