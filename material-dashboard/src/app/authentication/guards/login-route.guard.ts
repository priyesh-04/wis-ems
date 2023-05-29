import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginRouteGuard implements CanActivate {
 constructor(private _authService: AuthService,
                private _router: Router) {}

    canActivate(route:ActivatedRouteSnapshot,
                state:RouterStateSnapshot): boolean {
        
            if (this._authService.checkToken()) {
                this._router.navigate(['/']);
                return false;
            }
            return true;
        }
}