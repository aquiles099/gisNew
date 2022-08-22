import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {

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

	public delete(id:number):Observable<any>
	{
		return this._http.delete(`${this.baseUrl}/administracion/usuarios/${id}`);
	}


    public getDataTable(dataTablesParameters: object={}): Observable<any>
	{
		return this._http.post(`${this.baseUrl}/datatables/usuarios`, dataTablesParameters);
	}

	public store(data:any):Observable<any>
	{
		//const httpHeaders = this.setAuthenticationHeaders();

		return this._http.post(`${this.baseUrl}/administracion/usuarios-administracion`, data);
	}


	public update(data:any):Observable<any>
	{
		//const httpHeaders = this.setAuthenticationHeaders();

		return this._http.post(`${this.baseUrl}/administracion/usuarios/${data.get('user_id')}`, data);
	}

	public changeStatus(data:any):Observable<any>
	{
		//const httpHeaders = this.setAuthenticationHeaders();

		return this._http.post(`${this.baseUrl}/administracion/usuarios/cambiar-status`, data);
	}


	public show(id:number):Observable<any>
	{
    return this._http
              .get(`${this.baseUrl}/administracion/usuarios/${id}`);
	}
	

}

