import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { LoginComponent } from "./authentication/login/login.component";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { AuthGuard } from "./authentication/guards/auth.guard";
import { CookieService } from "ngx-cookie-service";
import { TokenInterceptor } from "./authentication/interceptors/token.interceptor";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { BasicModule } from "./basic/basic.module";
import { AdminViewModule } from "./admin/admin.module";
import { PasswordChangeComponent } from "./authentication/password-change/password-change.component";
import { UserProfileComponent } from './authentication/profile/user-profile/user-profile.component';
import { DatePipe } from "@angular/common";
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    BasicModule,
    AdminViewModule,
    RouterModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    PasswordChangeComponent,
    UserProfileComponent,
    ForgotPasswordComponent,
  ],
  providers: [
    AuthGuard,
    CookieService,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
