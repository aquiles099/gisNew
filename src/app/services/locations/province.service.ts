import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { HttpClient } from '@angular/common/http';
import { Municipality } from '../../interfaces/municipality';

@Injectable()
export class ProvinceService extends CrudService
{
  constructor(
    protected httpClient:HttpClient
  ) {
    super(
      httpClient,
      'ubicaciones/provincias'
    )
   }

   public async getMunicipalities(id:number):Promise<Partial<Municipality>[]>
   {
    try
    {
        return await this.httpClient.get<any>(`${this.baseUrl}/${id}/municipios`).toPromise();
    }
    catch (error)
    {
        throw error;
    }
   }
}
