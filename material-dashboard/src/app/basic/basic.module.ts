import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { HomeComponent } from "./home/home.component";
import { ConfirmDeleteComponent } from "./confirm-delete/confirm-delete.component";
import { ComponentsModule } from "../components/components.module";

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    MatButtonModule, 
    MatIconModule, 
    ComponentsModule
  ],
  declarations: [
    HomeComponent, 
    ConfirmDeleteComponent
  ],
  exports: [
    HomeComponent, 
    MatButtonModule, 
    MatIconModule
  ],
})
export class BasicModule {}
