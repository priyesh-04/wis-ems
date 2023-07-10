import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EmployeeTableComponent } from './employee-table/employee-table.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    EmployeeTableComponent,
    PaginationComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    EmployeeTableComponent,
    PaginationComponent
  ]
})
export class ComponentsModule { }
