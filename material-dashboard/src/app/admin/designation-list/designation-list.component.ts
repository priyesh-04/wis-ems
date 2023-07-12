import {
  Component,
  OnInit,
  ElementRef,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { DesignationFormComponent } from "../designation-form/designation-form.component";
import { MesgageService } from "../../services/shared/message.service";
import { DesignationService } from "../../services/designation/designation.service";
import { ConfirmDeleteComponent } from "../../basic/confirm-delete/confirm-delete.component";
import { pagination, params } from "../../commonModels";

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: "app-designation-list",
  templateUrl: "./designation-list.component.html",
  styleUrls: ["./designation-list.component.css"],
})
export class DesignationListComponent implements OnInit {
  private params: params;
  public designationList: any;
  public pagination: pagination;
  public limit = 10;

  constructor(
    private _designationService: DesignationService,
    private _mesgageService: MesgageService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.params = {
      limit: this.limit,
      page: 1
    };
    this.refreshDesignationList();
  }

  private refreshDesignationList() {
    this._designationService.getDesignationList(this.params).subscribe(
      (res) => {
        this.designationList = res.result;
        this.pagination = res.pagination;
      },
      (err) => {
        this._mesgageService.showError(err.error.message || 'Unable to fetch designation list');
      }
    );
  }

  public confirmDeleteDialog(id: number): void {
    const deleteDialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        title: "Delete Designation",
        message: "Are you sure you want to delete this designation?",
        id: id,
        callingFrom: "designation",
      },
    });

    deleteDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshDesignationList();
        this._mesgageService.showSuccess(result.message)
      }else{
        this._mesgageService.showError(result.error.message);        
      }
    });
  }

  public addDesignationDialog() {
    const designationDialogRef = this.dialog.open(DesignationFormComponent, {
      data: {
        matDialogTitle: "Add New Designation",
        mode: "add",
      },
      width: "90%",
      height: "90%",
      panelClass: "add-new-designation-dialog",
    });
    designationDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshDesignationList();
      }
    });
  }

  public updateDesignationDialog(designationData) {
    const designationDialogRef = this.dialog.open(DesignationFormComponent, {
      data: {
        matDialogTitle: "Update Designation",
        designationData: designationData,
        mode: "edit",
      },
      width: "90%",
      height: "90%",
      panelClass: "update-designation-dialog",
    });
    designationDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshDesignationList();
      }
    });
  }

  public onPaginationChange(event: params) {
    this.params = event;
    this.limit = this.params.limit;
    this.refreshDesignationList();
  }
}
