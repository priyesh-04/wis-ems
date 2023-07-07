import { Injectable } from '@angular/core';
import { HttpRequest,
        HttpHandler,
        HttpEvent,
        HttpInterceptor,
        HttpResponse,
        HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { MesgageService } from '../../services/shared/message.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(
        private _cookieService: CookieService,
        private _mesgageService: MesgageService,
        private _router: Router
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this._cookieService.get('token');
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `JWT ${token}`,
                }
            });
        }

        return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                if(event.body?.first_login === true) {
                    this._router.navigate(['/change-password']);
                }
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401 || err.status === 403) {
                    const currentUrl = this._router.url;
                    if (currentUrl != '/login') {
                        this._mesgageService.showError('Session ended, please login again');
                        this._cookieService.delete('token', '/');
                        this._router.navigate(['/login'], { queryParams: { next: currentUrl } });
                    }
                }
            }
        }));
    }
}
