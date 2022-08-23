import { Injectable } from '@angular/core';
import { CrudService } from '../../crud.service';
import { HttpClient } from '@angular/common/http';
import { Feature, Geometry, Point } from '@turf/helpers';
import { MapLayerService } from './map-layer.service';
import { GeoJSONHelper } from '@models/gis/geojson-helper';
import { RequestedProjectService } from '../../requested-project.service';

@Injectable()
export class FeatureService extends CrudService
{
  constructor(
    protected httpClient:HttpClient,
    public mapLayerService:MapLayerService,
    public requestedProjectService:RequestedProjectService,

  )
  {
    super(
      httpClient,
      `proyectos/${requestedProjectService.id}/gis/capas/:layerId/elementos`,
      "gis"
    )
  }

  public async getOfProjectedLayers(geom:Geometry, range:number = 5):Promise<{[layerName:string]:{layer_id:number, display_name:string, features:Feature<any>[]}}>
  {
    try
    {
      const baseUrl = this.baseUrl.slice(0, this.baseUrl.indexOf('gis') + 3); 
      
      const wkt = GeoJSONHelper.geometryToWkt(geom);
      
      const layerIds = this.mapLayerService
                          .projectedLayers
                          .map(layer => layer.id);

      const data = {
        [ geom.type.toLowerCase() ]: wkt,
        "range": range,
        "layer_ids": layerIds,
        "layer_filters": []
      };

      return await this.httpClient.post<{[layerName:string]:{layer_id:number, display_name:string, features:Feature<any>[]}}>(`${baseUrl}/obtener-elementos`,data).toPromise();
    }
    catch (error)
    {
      throw error;
    }
  }

  public async getElementSelect(idElement:any, idCapa:number) {
    try{
      const baseUrl = this.baseUrl.slice(0, this.baseUrl.indexOf('capas') + 5);  
    
      return await this.httpClient.get<any>(`${baseUrl}/${idCapa}/elementos/${idElement}`).toPromise();

    }catch (error)
    {
      throw error;
    }
    
  }
}
