import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: "root"
})
export class ProjectService extends CrudService
{
  urlList = 'http://46.183.116.100/smart-gest-backend/public/api/administracion/proyectos/listado';

  constructor(
    protected http:HttpClient
  )
  {
    super(
      http,
      'administracion/proyectos'
    );
  }

  public async getSimpleList():Promise<any>
   {
    try
    {
        return await this.httpClient.get<any>(`${this.baseUrl}/listado`).toPromise();
    }
    catch (error)
    {
      throw error;
    }
  }

  public async getListOptions():Promise<any>
  {
    try
    {
        return await this.httpClient.get<any>(`${this.urlList}`).toPromise();
    }
    catch (error)
    {
      throw error;
    }
  }
}
