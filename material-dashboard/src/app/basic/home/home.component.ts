import { Component, OnInit } from "@angular/core";

import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  public user: any;

  constructor(public _authService: AuthService) {}

  ngOnInit(): void {
    this.user = this._authService.getUserDetail();
  }

}
