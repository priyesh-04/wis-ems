import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "app/services/auth/auth.service";

declare const $: any;
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
    title: "Timesheet List",
    icon: "article",
    class: "",
  }
];
export const hrROUTES: RouteInfo[] = [
  { path: "/dashboard", title: "Dashboard", icon: "dashboard", class: "" },
  {
    path: "/hr/employee-list",
    title: "Employee List",
    icon: "article",
    class: "",
  },
  {
    path: "/hr/client-list",
    title: "Client List",
    icon: "article",
    class: "",
  },
  {
    path: "/hr/designation-list",
    title: "Designation List",
    icon: "article",
    class: "",
  },
  // { path: "/logout", title: "Logout", icon: "power_settings_new", class: "" },
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
    path: "/admin/client-list",
    title: "Client List",
    icon: "supervised_user_circle",
    class: "",
  },
  {
    path: "/admin/designation-list",
    title: "Designation List",
    icon: "article",
    class: "",
  },
  {
    path: "/admin/task-request",
    title: "Task Request",
    icon: "work",
    class: "",
  },
  // { path: "/logout", title: "Logout", icon: "power_settings_new", class: "" },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  loggedInUser: any;
  menuItems: any[];

  constructor(public _authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loggedInUser = this._authService.getLoggedInUser();
    const user = this._authService.getUserDetail();
    console.log(user, "user");
    if (!user) {
      this._authService.performLogout(user.id);
      this.router.navigate(["/login"]);
    } else {
      if (user.role === "admin") {
        this.menuItems = adminROUTES.filter((listTitle) => listTitle);
      } else if (user.role === "employee") {
        this.menuItems = employeeROUTES.filter((listTitle) => listTitle);
      } else if (user.role === "hr") {
        this.menuItems = hrROUTES.filter((listTitle) => listTitle);
      }
    }
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
