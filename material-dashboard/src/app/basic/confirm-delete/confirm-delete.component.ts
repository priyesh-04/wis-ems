import { Component, Inject } from "@angular/core";
import { DesignationService } from "app/services/designation/designation.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: "confirm-delete",
  templateUrl: "confirm-delete.html",
})
export class ConfirmDeleteComponent {
  constructor(
    public _designationService: DesignationService,
    public deleteDialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public deleteDialogData: DialogData
  ) {}

  onNoClick(): void {
    this.deleteDialogRef.close();
  }

  onYesClick(id): void {
    // console.log(id, "id");
    this.deleteUserType(id);
  }

  deleteUserType(id: number) {
    this._designationService.deleteDesignation(id).subscribe(
      (res) => {
        console.log(res, "res");
        this.deleteDialogRef.close("success");
      },
      (err) => {
        console.log(err, "error");
      }
    );
  }
}
