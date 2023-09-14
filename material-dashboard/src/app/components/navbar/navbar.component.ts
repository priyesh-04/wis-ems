import { Component, OnInit, ElementRef } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";

import {
  adminROUTES,
  employeeROUTES,
  hrROUTES,
} from "../sidebar/sidebar.component";
import { ConfirmDeleteComponent } from "../../basic/confirm-delete/confirm-delete.component";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  private listTitles = [];
  private currentPage: Location;
  private mobile_menu_visible = 0;
  private toggleButton: any;
  private sidebarVisible = false;
  private userId : string;
  public userName : string;
  public isAdmin: boolean;

  constructor(
    private location: Location,
    private element: ElementRef,
    private router: Router,
    private _authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.currentPage = this.location;

    const user = this._authService.getUserDetail();
    if (user) {
      this.userId = user.id;
      this.userName = user.name;
      this.isAdmin = user.role === 'admin';
      if (user.role === "admin") {
        this.listTitles = adminROUTES.filter((listTitle) => listTitle);
      } else if (user.role === "employee") {
        this.listTitles = employeeROUTES.filter((listTitle) => listTitle);
      } else if (user.role === "hr") {
        this.listTitles = hrROUTES.filter((listTitle) => listTitle);
      }
    }

    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];

    this.router.events.subscribe(() => {
      this.sidebarClose();
      const $layer: any = document.getElementsByClassName("close-layer")[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });
  }

  private sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName("body")[0];
    setTimeout(function () {
      toggleButton.classList.add("toggled");
    }, 500);
    body.classList.add("nav-open");
    this.sidebarVisible = true;
  }

  private sidebarClose() {
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton.classList.remove("toggled");
    this.sidebarVisible = false;
    body.classList.remove("nav-open");
  }

  public sidebarToggle() {
    var $toggle = document.getElementsByClassName("navbar-toggler")[0];
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const body = document.getElementsByTagName("body")[0];    
    if (this.mobile_menu_visible == 1) {
      body.classList.remove("nav-open");
      if ($layer) {
        $layer.remove();
      }
      setTimeout(function () {
        $toggle.classList.remove("toggled");
      }, 400);

      this.mobile_menu_visible = 0;
    } else {
      setTimeout(function () {
        $toggle.classList.add("toggled");
      }, 430);

      var $layer = document.createElement("div");
      $layer.setAttribute("class", "close-layer");

      if (body.querySelectorAll(".main-panel")) {
        document.getElementsByClassName("main-panel")[0].appendChild($layer);
      } else if (body.classList.contains("off-canvas-sidebar")) {
        document
          .getElementsByClassName("wrapper-full-page")[0]
          .appendChild($layer);
      }

      setTimeout(function () {
        $layer.classList.add("visible");
      }, 100);

      $layer.onclick = function () {
        body.classList.remove("nav-open");
        this.mobile_menu_visible = 0;
        $layer.classList.remove("visible");
        setTimeout(function () {
          $layer.remove();
          $toggle.classList.remove("toggled");
        }, 400);
      }.bind(this);

      body.classList.add("nav-open");
      this.mobile_menu_visible = 1;
    }
  }

  public profileLogout(){
    const deleteDialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        message: "Are you sure you want to Logout?",
        userId :this.userId,
        callingFrom: "logOut",
        mode:'logout'
      },
    });
    deleteDialogRef.afterClosed().subscribe(() => {
      this.router.navigate(["/login"]);
    });
  }

  public getTitle() {
    let title = this.currentPage.prepareExternalUrl(this.currentPage.path());
     
    if (title.charAt(0) === "#") {
      title = title.slice(1);
    }
    if (title === '/profile') {
      return 'Profile';
    } else if (title === '/change-password') {
      return 'Change Password';
    }

    for (let item = 0; item < this.listTitles.length; item++) {      
      if (this.listTitles[item].path === title) {
        return this.listTitles[item].title;
      }        
    }
    return "Dashboard";
  }
}
