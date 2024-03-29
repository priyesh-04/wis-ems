import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./authentication/login/login.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginRouteGuard } from "./authentication/guards/login-route.guard";
import { ForgotPasswordComponent } from "./authentication/forgot-password/forgot-password.component";
import { SetNewPasswordComponent } from "./authentication/set-new-password/set-new-password.component";
import { PageNotFoundComponent } from "./authentication/page-not-found/page-not-found.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  { 
    path: "login", 
    component: LoginComponent, 
    canActivate: [LoginRouteGuard] 
  },
  { 
    path: "forgot-password", 
    component: ForgotPasswordComponent,
    canActivate: [LoginRouteGuard] 
  },
  { 
    path: "reset-password/:userId/:token", 
    component: SetNewPasswordComponent 
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
  { 
    path: '**', 
    pathMatch: 'full', 
    component: PageNotFoundComponent 
  },
];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes)],
  exports: [],
})
export class AppRoutingModule {}
