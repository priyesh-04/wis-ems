import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import {
  validatorIndianMobileNumber,
  validatorEmail,
  validatorTextOnly,
  getFormattedDate,
  formatDateToDDMMYYYY,
} from "../../utils/custom-validators";
import { ClientListComponent } from "../client-list/client-list.component";
import { MesgageService } from "../../services/shared/message.service";
import { ClientService } from "../../services/client/client.service";

@Component({
  selector: "app-client-form",
  templateUrl: "./client-form.component.html"
})
export class ClientFormComponent implements OnInit {
  public clientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _clientService: ClientService,
    private _mesgageService: MesgageService,
    private dialogRef: MatDialogRef<ClientListComponent>,
    @Inject(MAT_DIALOG_DATA) public clientDialogData
  ) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      client_name: ["", [Validators.required]],
      company_name: ["", [Validators.required, validatorTextOnly]],
      company_email: ["", [Validators.required, validatorEmail]],
      mobile_number: ["", [Validators.required, validatorIndianMobileNumber]],
      start_date: ["", [Validators.required]],
      end_date: ["", [Validators.required]],
      person_name: ["", [Validators.required, validatorTextOnly]],
    });

    if (this.clientDialogData.mode === "edit") {
      this.clientForm.patchValue({
        client_name: this.clientDialogData.clientData.client_name,
        company_name: this.clientDialogData.clientData.company_name,
        company_email: this.clientDialogData.clientData.company_email,
        mobile_number: this.clientDialogData.clientData.mobile_number,
        start_date: formatDateToDDMMYYYY(
          this.clientDialogData.clientData.start_date
        ),
        end_date: formatDateToDDMMYYYY(this.clientDialogData.clientData.end_date),
        person_name: this.clientDialogData.clientData.person_name,
      });
    }
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public get myClientForm() {
    return this.clientForm.controls;
  }

  public onSubmit(clientForm: FormGroup) {
    let clientData = clientForm.value;
    clientData.start_date=clientData.start_date  +"T00:00:00+05:30";
    clientData.end_date=clientData.end_date  +"T00:00:00+05:30"
    if (this.clientDialogData.mode === "edit") {
      this._clientService
        .updateClient(this.clientDialogData.clientData._id, clientData)
        .subscribe(
          (res) => {
            this.dialogRef.close("success");
            this._mesgageService.showSuccess(res.message);
          },
          (err) => {
            this._mesgageService.showError(err.error.message);
          }
        );
    } else if (this.clientDialogData.mode === "add") {
      this._clientService.addClient(clientData).subscribe(
        (res) => {
          this.dialogRef.close("success");
          this._mesgageService.showSuccess(res.message);
        },
        (err) => {
          this._mesgageService.showError(err.error.message);
        }
      );
    }
  }
}
