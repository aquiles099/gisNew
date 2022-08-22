import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResourceService {

	private baseUrl:string;

	constructor(
		private _http: HttpClient
		)
	{
		this.baseUrl = environment.administrationApiUrl;
	}

	public getMunicipalities():Observable<any>
	{
		return this._http.get(`${this.baseUrl}/resources/locations/municipios`);
	}

	public getProjectWorkModules():Observable<any>
	{
		return this._http.get(`${this.baseUrl}/resources/projects/work-modules`);
	}

	public getProjectRole():Observable<any>
	{
		return this._http.get(`${this.baseUrl}/resources/projects/roles`);
	}


   

}

