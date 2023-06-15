import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./authentication/login/login.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { PasswordChangeComponent } from "./authentication/password-change/password-change.component";
import { AuthGuard } from "./authentication/guards/auth.guard";
import { LoginRouteGuard } from "./authentication/guards/login-route.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  { path: "login", component: LoginComponent, canActivate: [LoginRouteGuard] },
  {
    path: "change-password",
    component: PasswordChangeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./layouts/admin-layout/admin-layout.module").then(
            (m) => m.AdminLayoutModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes)],
  exports: [],
})
export class AppRoutingModule {}
