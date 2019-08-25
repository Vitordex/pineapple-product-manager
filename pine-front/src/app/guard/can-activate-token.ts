import { CanActivate, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CanActivateToken implements CanActivate {
    constructor(private tokenService: TokenService, private router: Router) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const hasToken = !!this.tokenService.getToken();
        if (!hasToken) {
            this.router.navigate(['/auth/']);
        }

        return hasToken;
    }
}
