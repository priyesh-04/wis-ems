import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ConfirmDeleteComponent } from "./confirm-delete/confirm-delete.component";
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { ComponentsModule } from "../components/components.module";

@NgModule({
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, ComponentsModule],
  declarations: [HomeComponent, ConfirmDeleteComponent, AlertMessageComponent],
  exports: [HomeComponent, MatButtonModule, MatIconModule],
})
export class BasicModule {}
