import { Component, OnInit } from "@angular/core";
import { SharedService } from "app/services/shared/shared.service";

@Component({
  selector: "app-alert-message",
  templateUrl: "./alert-message.component.html",
  styleUrls: ["./alert-message.component.css"],
})
export class AlertMessageComponent implements OnInit {
  constructor(private _sharedService: SharedService) {}

  ngOnInit(): void {
    this._sharedService.currentMessage.subscribe((message) => {
      console.log(message, "message");
    });
  }
}
