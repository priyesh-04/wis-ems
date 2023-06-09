import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  validatorIndianMobileNumber,
  validatorEmail,
  validatorTextOnly,
  getFormattedDate,
} from "../../utils/custom-validators";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ClientService } from "app/services/client/client.service";
import { ClientListComponent } from "../client-list/client-list.component";

@Component({
  selector: "app-client-form",
  templateUrl: "./client-form.component.html",
  styleUrls: ["./client-form.component.css"],
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup;
  clientData: any;

  constructor(
    private _clientService: ClientService,
    public fb: FormBuilder,

    public dialogRef: MatDialogRef<ClientListComponent>,
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
        start_date: getFormattedDate(
          this.clientDialogData.clientData.start_date
        ),
        end_date: getFormattedDate(this.clientDialogData.clientData.end_date),
        person_name: this.clientDialogData.clientData.person_name,
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  get myClientForm() {
    return this.clientForm.controls;
  }

  onSubmit(clientForm: FormGroup) {
    this.clientData = clientForm.value;
    if (this.clientDialogData.mode === "edit") {
      this._clientService
        .updateClient(this.clientDialogData.clientData._id, this.clientData)
        .subscribe(
          (res) => {
            this.dialogRef.close("success");
          },
          (err) => {
            alert(err.error.detail);
            console.log(err, "error");
          }
        );
    } else if (this.clientDialogData.mode === "add") {
      this._clientService.addClient(this.clientData).subscribe(
        (res) => {
          this.dialogRef.close("success");
        },
        (err) => {
          alert(err.error.detail);
          console.log(err, "error");
        }
      );
    }
  }
}
