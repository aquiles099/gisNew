import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RequestedProjectService } from '../../requested-project.service';
import { environment } from '../../../../environments/environment';

@Injectable()
export class MapResourceService {

  private baseUrl:string;

  constructor(
    private httpClient:HttpClient,
    private _requestedProjectService:RequestedProjectService
  )
  {
    this.baseUrl = environment.administrationApiUrl;
  }

  public async getToolsAndModulesForAuthUserOnProject():Promise<any>
  {
    try
    {
        return await this.httpClient.get<any>(`${this.baseUrl}/gis/proyectos/${this._requestedProjectService.id}/mapa`).toPromise();
    }
    catch (error)
    {
        throw error;
    }
  }
}
