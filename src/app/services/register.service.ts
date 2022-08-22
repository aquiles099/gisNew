import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable()
export class RegisterService {

	private baseUrl:string;

	constructor(
		private _http: HttpClient
		)
	{
		this.baseUrl = environment.administrationApiUrl;
	}


	setAuthenticationHeaders(): object
	{
		const token = localStorage.getItem('token'),
		httpHeaders = {
			headers: new HttpHeaders({
				'Authorization': `Bearer  ${token}`
			})
		};

		return httpHeaders;
	}


	public store(data:any):Observable<any>
	{

		return this._http.post(`${this.baseUrl}/register`, data);
	}
}

