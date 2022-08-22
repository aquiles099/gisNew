import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable()
export class CompanyService extends CrudService
{

  private datatableUrl:string;

  constructor(
    protected httpClient:HttpClient
  ) {
    super(
      httpClient,
      'administracion/empresas'
    )

    this.datatableUrl=environment.administrationApiUrl;
   }

   public async getUsers(id:number):Promise<any>
   {
     try
     {
     return await this.httpClient.get<any>(`${this.baseUrl}/empresas/${id}/usuarios`).toPromise();
     }
     catch (error)
     {
     throw error;
     }
   }
 
    public getDataTable(dataTablesParameters: object={}): Observable<any>
   {
     return this.httpClient.post(`${this.datatableUrl}/datatables/empresas`, dataTablesParameters);
   }
}
