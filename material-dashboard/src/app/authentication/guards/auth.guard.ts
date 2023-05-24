import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private _authService: AuthService,
                private _router: Router) {}

    canActivate(route:ActivatedRouteSnapshot,
                state:RouterStateSnapshot): boolean {
        
            if (this._authService.checkToken()) {
                return true;
            };           

            this._router.navigate(['/login'], { queryParams: {returnUrl: state.url} });
            return false;            

        }
}