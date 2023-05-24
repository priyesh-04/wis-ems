import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  user: any;
  data: any;

  constructor(public _authService: AuthService, public _router: Router) {}

  ngOnInit(): void {
    this.user = this._authService.getLoggedInUser();
  }
}
