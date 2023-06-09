import { Component, Inject } from "@angular/core";
import { DesignationService } from "app/services/designation/designation.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ClientService } from "app/services/client/client.service";

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
    private _designationService: DesignationService,
    private _clientService: ClientService,
    public deleteDialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public deleteDialogData: DialogData
  ) {}

  onNoClick(): void {
    this.deleteDialogRef.close();
  }

  onYesClick(data): void {
    if (data.callingFrom === "designation") {
      this.deleteDesignation(data.id);
    } else if (data.callingFrom === "client") {
      this.deleteClient(data.id);
    }
  }

  deleteDesignation(id: number) {
    this._designationService.deleteDesignation(id).subscribe(
      (res) => {
        console.log(res, "res");
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this.deleteDialogRef.close(err);
        console.log(err, "error");
      }
    );
  }

  deleteClient(id: number) {
    this._clientService.deleteClient(id).subscribe(
      (res) => {
        console.log(res, "res");
        this.deleteDialogRef.close("success");
      },
      (err) => {
        this.deleteDialogRef.close(err);
        console.log(err, "error");
      }
    );
  }
}
