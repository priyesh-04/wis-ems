import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { ClientService } from "../../services/client/client.service";
import { ClientFormComponent } from "../client-form/client-form.component";
import { ConfirmDeleteComponent } from "../../basic/confirm-delete/confirm-delete.component";
import { MesgageService } from "../../services/shared/message.service";
import { pagination, params } from "../../commonModels";

@Component({
  selector: "app-client-list",
  templateUrl: "./client-list.component.html"
})
export class ClientListComponent implements OnInit {
  private params: params;
  public clientList = [];
  public pagination: pagination;
  public limit = 10;
  public currentPage = 1;
  public totalPage = 0;
  public isLoading = false;

  constructor(
    private dialog: MatDialog,
    private _clientService: ClientService,
    private _mesgageService: MesgageService,    
  ) {}

  ngOnInit(): void {
    this.params = {
      limit: this.limit,
      page: 1
    };
    this.refreshClientList();
  }

  private refreshClientList() {
    this.isLoading = !this.isLoading;
    this._clientService.getClientList(this.params).subscribe(
      (res) => {
        this.isLoading = !this.isLoading;
        this.clientList = res.result;
        this.pagination = res.pagination;
        this.totalPage = res.pagination.total_page
      },
      (err) => {
        this.isLoading = !this.isLoading;
        this._mesgageService.showError(err.error.message || 'Unable to fetch client list');        
      }
    );
  }

  public deleteClientDialog(id) {
    const deleteDialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        title: "Delete Client",
        message: "Are you sure you want to delete this client?",
        id: id,
        callingFrom: "client",
      },
    });

    deleteDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this._mesgageService.showSuccess(result.message);        
      } else if (result.error) {
        this._mesgageService.showError(result.error.message);        
      }
    });
  }

  public addClientDialog() {
    const clientDialogRef = this.dialog.open(ClientFormComponent, {
      data: {
        matDialogTitle: "Add New Client",
        mode: "add",
      },
      width: "90%",
      height: "90%",
      panelClass: "add-new-client-dialog",
    });
    clientDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshClientList();    
      }
    });
  }

  public updateClientDialog(clientData) {
    const clientDialogRef = this.dialog.open(ClientFormComponent, {
      data: {
        matDialogTitle: "Update Client Details",
        clientData: clientData,
        mode: "edit",
      },
      width: "90%",
      height: "90%",
      panelClass: "update-client-dialog",
    });
    clientDialogRef.afterClosed().subscribe((result) => {
      if (result === "success") {
        this.refreshClientList();
      }
    });
  }

  public onPaginationChange(event: params) {
    this.params = event;
    this.limit = this.params.limit;
    this.refreshClientList();
  }
}
