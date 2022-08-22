import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthUserService } from '../services/auth-user.service';

@Injectable({
  providedIn: 'root'
})
export class UserHasSomeAdminRoleGuard implements CanActivate, CanActivateChild, CanLoad {
  
  public constructor(
    private _authUserService:AuthUserService,
    private _router:Router
  ){}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
  {
		return this.canActivate(childRoute, state);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    if( ! this._authUserService.user.hasSomeAdminRole )
      this._router.navigateByUrl("/home/no-autorizado");

    return this._authUserService.user.hasSomeAdminRole;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
      if( ! this._authUserService.user.hasSomeAdminRole )
        this._router.navigateByUrl("/home/no-autorizado");

      return this._authUserService.user.hasSomeAdminRole;
    }

}
