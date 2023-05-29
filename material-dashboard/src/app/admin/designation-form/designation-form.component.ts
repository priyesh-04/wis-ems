import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { validatorTextOnly } from "../../utils/custom-validators";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DesignationService } from "app/services/designation/designation.service";
import { DesignationListComponent } from "../designation-list/designation-list.component";

@Component({
  selector: "app-designation-form",
  templateUrl: "./designation-form.component.html",
  styleUrls: ["./designation-form.component.css"],
})
export class DesignationFormComponent implements OnInit {
  designationForm: FormGroup;
  designationData: any;

  constructor(
    private _designationService: DesignationService,
    public fb: FormBuilder,

    public designationDialogRef: MatDialogRef<DesignationListComponent>,
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

  closeDialog() {
    this.designationDialogRef.close();
  }

  addDesignation(designationForm: FormGroup) {
    this.designationData = designationForm.value;
    if (this.designationDialogData.mode === "edit") {
      this._designationService
        .updateDesignation(
          this.designationDialogData.designationData._id,
          this.designationData
        )
        .subscribe(
          (res) => {
            this.designationDialogRef.close("success");
          },
          (err) => {
            alert(err.error.detail);
            console.log(err, "error");
          }
        );
    } else if (this.designationDialogData.mode === "add") {
      this._designationService.addDesignation(this.designationData).subscribe(
        (res) => {
          this.designationDialogRef.close("success");
        },
        (err) => {
          alert(err.error.detail);
          console.log(err, "error");
        }
      );
    }
  }
}
