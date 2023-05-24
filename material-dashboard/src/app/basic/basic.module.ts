import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ConfirmDeleteComponent } from "./confirm-delete/confirm-delete.component";

@NgModule({
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  declarations: [HomeComponent, ConfirmDeleteComponent],
  exports: [HomeComponent, MatButtonModule, MatIconModule],
})
export class BasicModule {}