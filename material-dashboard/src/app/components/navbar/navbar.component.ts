import { Component, OnInit, ElementRef } from "@angular/core";
import {
  adminROUTES,
  employeeROUTES,
  hrROUTES,
} from "../sidebar/sidebar.component";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "app/services/auth/auth.service";
import { ConfirmDeleteComponent } from "../../basic/confirm-delete/confirm-delete.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  loggedInUser: any;
  private listTitles: any[];
  location: Location;
  mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  public userName : string;
  public isAdmin: boolean;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    public _authService: AuthService,
    public dialog: MatDialog
  ) {
    this.location = location;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    this.loggedInUser = this._authService.getLoggedInUser();
    const user = this._authService.getUserDetail();
    this.userName = user.name;
    this.isAdmin = user.role === 'admin';
    if (!user) {
      this._authService.performLogout();
      this.router.navigate(["/login"]);
    } else {
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
    this.router.events.subscribe((event) => {
      this.sidebarClose();
      var $layer: any = document.getElementsByClassName("close-layer")[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName("body")[0];
    setTimeout(function () {
      toggleButton.classList.add("toggled");
    }, 500);

    body.classList.add("nav-open");

    this.sidebarVisible = true;
  }
  sidebarClose() {
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton.classList.remove("toggled");
    this.sidebarVisible = false;
    body.classList.remove("nav-open");
  }
  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    var $toggle = document.getElementsByClassName("navbar-toggler")[0];

    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const body = document.getElementsByTagName("body")[0];

    if (this.mobile_menu_visible == 1) {
      // $('html').removeClass('nav-open');
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
        //asign a function
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
        title: "Profile Logout",
        message: "Are you sure you want to Logout?",
        callingFrom: "logOut",
      },
    });
    deleteDialogRef.afterClosed().subscribe((result) => {
      
    });
  }
  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
     
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }
    if (titlee == '/profile') {
      return 'Personal Details';
    }
    for (var item = 0; item < this.listTitles.length; item++) {
      
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }        
    }
    return "Dashboard";
  }
}
