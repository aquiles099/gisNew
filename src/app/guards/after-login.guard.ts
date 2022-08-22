import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree, Router, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { AuthUserService } from '../services/auth-user.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class AfterLoginGuard implements CanActivate, CanActivateChild
{
  	private authUser:User;

	constructor(
		private _authService: AuthService,
		private _authUserService: AuthUserService,
		private _tokenService: TokenService,
		private router: Router
	)
	{
		this._authUserService.userObservable.subscribe(
			(authUser:User) => this.authUser = authUser
		);
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | Observable<boolean> | Promise<boolean>
	{		
		if( ! this._tokenService.isLoggedIn )
			this.redirectToLogin(state);

		return  this._tokenService.isLoggedIn;
	}

	canActivateChild(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | Observable<boolean> | Promise<boolean>
	{
		return this.canActivate(route, state);
	}
	
	canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean
	{
		return true;
	}

	private redirectToLogin(state:RouterStateSnapshot):boolean | Promise<boolean>
	{
		this._authService.redirect = state.url;

		this._authService.logoutByTokenExpiration(false);
		
		return this._tokenService.isLoggedIn;
	}
}
