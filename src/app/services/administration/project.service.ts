import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: "root"
})
export class ProjectService extends CrudService
{
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
}
