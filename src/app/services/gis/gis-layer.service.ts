import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { HttpClient } from '@angular/common/http';
import { RequestedProjectService } from '../requested-project.service';
import { LayerAttribute } from '../../interfaces/layer-attribute';

@Injectable()
export class GisLayerService extends CrudService
{
  constructor(
    protected httpClient:HttpClient,
    public requestedProjectService:RequestedProjectService
  )
  {
    super(
      httpClient,
      `proyectos/${requestedProjectService.id}/gis/capas`,
      "gis"
    )
  }

  public async getAllowedAttributesPerTool(id:number, toolName?:string):Promise<LayerAttribute[]>
  {
    try
    {
        return await this.httpClient.get<LayerAttribute[]>(`${this.baseUrl}/${id}/atributos`).toPromise();
    }
    catch (error)
    {
        throw error;
    }
  }
}