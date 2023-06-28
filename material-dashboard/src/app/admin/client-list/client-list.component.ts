import {
  Component,
  OnInit,
  ElementRef,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ClientService } from "../../services/client/client.service";
import { ClientFormComponent } from "../client-form/client-form.component";
import { ConfirmDeleteComponent } from "../../basic/confirm-delete/confirm-delete.component";
import { MesgageService } from "../../services/shared/message.service";
@Component({
  selector: "app-client-list",
  templateUrl: "./client-list.component.html",
  styleUrls: ["./client-list.component.css"],
})
export class ClientListComponent implements OnInit {
  @ViewChildren("pageList") pages: QueryList<ElementRef<HTMLLIElement>>;
  clientList: any;
  searchText: string;
  alertMessage: string = "";
  alertType: string = "";

  constructor(
    private _clientService: ClientService,
    public dialog: MatDialog,
    private _mesgageService: MesgageService,    
  ) {}

  deleteClientDialog(id) {
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

  addClientDialog() {
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
        this._mesgageService.showSuccess(result.message);     
      }
    });
  }

  updateClientDialog(clientData) {
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
        this.alertType = "success";
        this.alertMessage = "Client Details Updated Successfully!";
        setTimeout(() => {
          this.alertMessage = "";
        }, 3000);
      }
    });
  }

  ngOnInit(): void {
    this.refreshClientList();
  }

  onSearch() {
    this.refreshClientList(this.searchText);
  }

  refreshClientList(searchText?: string) {
    this._clientService.getClientList().subscribe(
      (res) => {
        this.clientList = res.result;
      },
      (err) => {
        this._mesgageService.showError(err.message);        
      }
    );
  }
}
