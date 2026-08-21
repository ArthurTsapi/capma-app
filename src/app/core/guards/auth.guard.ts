import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService, UserRole } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const requiredRoles = route.data?.['roles'] as UserRole[] | undefined;
    const requireAnyAuth = !requiredRoles || requiredRoles.length === 0;

    return this.authService.isAuthenticated().pipe(
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          const loginUrl = this.router.createUrlTree(
            ['/login'],
            { queryParams: { redirect: state.url, reason: 'auth-required' } }
          );
          return loginUrl;
        }
        if (requireAnyAuth) return true;
        const user = this.authService.getCurrentUserSync();
        if (!user) {
          return this.router.createUrlTree(
            ['/login'],
            { queryParams: { redirect: state.url, reason: 'no-user' } }
          );
        }
        const hasRole = requiredRoles.includes(user.role as UserRole);
        if (!hasRole) {
          const forbidden = user.role === 'admin' || user.role === 'reviewer'
            ? this.router.createUrlTree(['/admin'], { queryParams: { reason: 'forbidden' } })
            : this.router.createUrlTree(['/dashboard'], { queryParams: { reason: 'forbidden' } });
          return forbidden;
        }
        return true;
      })
    );
  }
}

export const authGuardFn: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  return inject(AuthGuard).canActivate(route, state);
};
