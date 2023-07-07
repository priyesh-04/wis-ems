import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { validatorTextOnly } from "../../utils/custom-validators";
import { DesignationListComponent } from "../designation-list/designation-list.component";
import { MesgageService } from "../../services/shared/message.service";
import { DesignationService } from "../../services/designation/designation.service";

@Component({
  selector: "app-designation-form",
  templateUrl: "./designation-form.component.html"
})
export class DesignationFormComponent implements OnInit {
  public designationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _designationService: DesignationService,
    private _mesgageService: MesgageService,    
    private designationDialogRef: MatDialogRef<DesignationListComponent>,
    @Inject(MAT_DIALOG_DATA) public designationDialogData
  ) {}

  ngOnInit(): void {
    this.designationForm = this.fb.group({
      name: ["", [Validators.required, validatorTextOnly]],
    });

    if (
      this.designationDialogData.designationData &&
      this.designationDialogData.mode === "edit"
    ) {
      this.designationForm.patchValue({
        name: this.designationDialogData.designationData.name,
      });
    }
  }

  public closeDialog() {
    this.designationDialogRef.close();
  }

  public addDesignation(designationForm: FormGroup) {
    const designationData = designationForm.value;
    if (this.designationDialogData.mode === "edit") {
      this._designationService
        .updateDesignation(
          this.designationDialogData.designationData._id,
          designationData
        )
        .subscribe(
          (res) => {
            this.designationDialogRef.close("success");
            this._mesgageService.showSuccess(res.message); 
          },
          (err) => {
            this._mesgageService.showError(err.error.message); 
          }
        );
    } else if (this.designationDialogData.mode === "add") {
      this._designationService.addDesignation(designationData).subscribe(
        (res) => {
          this.designationDialogRef.close("success");
          this._mesgageService.showSuccess(res.message); 
        },
        (err) => {
          this._mesgageService.showError(err.error.message);
        }
      );
    }
  }
}
