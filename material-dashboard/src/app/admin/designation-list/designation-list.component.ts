import {
  Component,
  OnInit,
  ElementRef,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { DesignationService } from "app/services/designation/designation.service";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDeleteComponent } from "app/basic/confirm-delete/confirm-delete.component";
import { DesignationFormComponent } from "../designation-form/designation-form.component";
import { MesgageService } from "../../services/shared/message.service";
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
  @ViewChildren("pageList") pages: QueryList<ElementRef<HTMLLIElement>>;
  designationList: any;
  searchText: string;
  alertMessage: string = "";
  alertType: string = "";

  constructor(
    private _designationService: DesignationService,
    public dialog: MatDialog,
    private _mesgageService: MesgageService
  ) {}

  confirmDeleteDialog(id: number): void {
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

  addDesignationDialog() {
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
        this._mesgageService.showSuccess(result.message)
      }else{
        this._mesgageService.showError(result.error.message);        
      }
    });
  }

  updateDesignationDialog(designationData) {
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
        this._mesgageService.showSuccess(result.message)
      }else{
        this._mesgageService.showError(result.error.message);        
      }
    });
  }

  ngOnInit(): void {
    this.refreshDesignationList();
  }

  onSearch() {
    this.refreshDesignationList(this.searchText);
  }

  refreshDesignationList(searchText?: string) {
    this._designationService.getDesignationList().subscribe(
      (res) => {
        this.designationList = res.result;
      },
      (err) => {
        this._mesgageService.showError(err.message);
      }
    );
  }
}
