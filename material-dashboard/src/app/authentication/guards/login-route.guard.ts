import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginRouteGuard implements CanActivate {
  
  constructor(
    private _authService: AuthService,
    private _router: Router
  ) {}

  canActivate(): boolean {
    if (this._authService.checkToken()) {
      this._router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}