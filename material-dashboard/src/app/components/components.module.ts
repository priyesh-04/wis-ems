import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { EmployeeTableComponent } from './employee-table/employee-table.component';
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    EmployeeTableComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    EmployeeTableComponent
  ]
})
export class ComponentsModule { }
