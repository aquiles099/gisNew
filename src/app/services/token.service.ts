import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class TokenService
{
  private token:string|null;

  private baseUrl:string;

	constructor(
		private _http: HttpClient
		)
	{
		this.baseUrl = environment.administrationApiUrl;
	}


  public checkToken(token:any,email:any):Observable<boolean>
  {
    let data={token:token,email:email};
		return this._http.post<boolean>(`${environment.administrationApiUrl}/check-token`, data);

  }

  get isLoggedIn():boolean
  {
    return this.token !== undefined && this.token !== null;
  }

  public setToken(token:string):void
  {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  public getToken():string|null
  {
    return this.token;
  }
 
  public clear():void
  {
    this.token = null;
    localStorage.removeItem('auth_token');
  }
}
