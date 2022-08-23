import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LaravelPaginator } from '../interfaces/laravel-paginator';

export class CrudService
{
    private _url: string;
    protected baseUrl: string;

    constructor(
        protected httpClient: HttpClient,
        protected resourceUrl:string,
        protected backend:"administration"|"gis" = "administration"
    )
    {
        let url = backend === "administration" ? 
        environment.administrationApiUrl :
        environment.gisUrl;

        this._url = this.baseUrl = `${url}/${resourceUrl}`;
    }

    get apiUrl():string
    {
        return environment.administrationApiUrl;
    }

    public setUrlParams(params:{[key:string]:string}):void
    {
        let url;

        for( let [key, value] of Object.entries(params) )
        {
            if( ! url )
                url = this._url;

            url = url.replace(`:${key}`, value);
        }
        
        this.baseUrl = url;
    }

    public async all(queryParams?:{[name:string]:string|number}): Promise<LaravelPaginator|any[]>
    {
        try
        {
            let params = "";

            if( queryParams )
            {
                let i = 0;
                let entries = Object.entries(queryParams);
                let entriesLength = entries.length;

                for(let [key, value] of entries)
                {
                    if(i === 0)
                        params += "?";

                    params += `${key}=${value}`;

                    if( i + 1 < entriesLength )
                        params += "&";
                
                    i++;
                }
            }

            const url = this.baseUrl + params;

            return await this.httpClient.get<LaravelPaginator>(url).toPromise();
        }
        catch (error)
        {
            throw error;
        }
    }

    public async create(): Promise<any>
    {
        try
        {
            return await this.httpClient.get<any>(`${this.baseUrl}/datos-para-creacion`).toPromise();
        }
        catch (error)
        {
            throw error;
        }
    }

    public async store(data: FormData|Object): Promise<any>
    {
        try
        {
          return await this.httpClient.post<any>(`${this.baseUrl}`, data).toPromise();    
        }
        catch (error)
        {
            throw error;
        }
    }

    public async show(id: number|string): Promise<any>
    {
        try
        {
          return await this.httpClient.get<any>(`${this.baseUrl}/${id}`).toPromise();            
        }
        catch (error)
        {
            throw error;
        }
    }

    public async download(key: number|string): Promise<any>
    {
        try
        {
            return await this.httpClient.get(`${this.baseUrl}/${key}`, { responseType: "arraybuffer" }).toPromise();
        }
        catch (error)
        {
            throw error;
        }
    }

    public async edit(): Promise<any>
    {
        try
        {
            return await this.httpClient.get<any>(`${this.baseUrl}/datos-para-edicion`).toPromise();
        }
        catch (error)
        {
            throw error;
        }
    }

    public async update(id: number, data: FormData|Object): Promise<any> 
    {
        try
        {
            let response;

            if( this.backend === "gis" )
            {
                data instanceof FormData ?
                data.append("_method", "PUT") :
                data["_method"] = "PUT";
    
                response = await this.httpClient.post<any>(`${this.baseUrl}/${id}`, data).toPromise();
            }
            else
            {
                response = await this.httpClient.post<any>(`${this.baseUrl}/${id}`, data).toPromise();
            }

            return response;
        }
        catch (error)
        {
            throw error;
        }
    }

    public async delete(id: number): Promise<any> {
        try
        {
            return await this.httpClient.delete<any>(`${this.baseUrl}/${id}`).toPromise();
        }
        catch (error)
        {
            throw error;
        }
    }
}
