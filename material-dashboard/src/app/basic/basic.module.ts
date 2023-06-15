import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ConfirmDeleteComponent } from "./confirm-delete/confirm-delete.component";
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { FormsModule }   from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
@NgModule({
  imports: [
    CommonModule, 
    RouterModule, 
    MatButtonModule,
    MatIconModule, 
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [HomeComponent, ConfirmDeleteComponent, AlertMessageComponent],
  exports: [HomeComponent, MatButtonModule, MatIconModule],
})
export class BasicModule {}
