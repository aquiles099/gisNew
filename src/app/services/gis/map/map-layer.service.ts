import { Injectable } from '@angular/core';
import { RequestedProjectService } from '../../requested-project.service';
import { Map } from 'leaflet';
import { Module } from '../../../interfaces/module';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { GisLayer } from '../../../models/gis-layer';

@Injectable()
export class MapLayerService
{
  private map:Map;

  private _modules:Module[];
  
  private layersSubject:BehaviorSubject<GisLayer[]>;
  
  public layer$:Observable<GisLayer[]>;
  
  public projectedLayer$:Observable<GisLayer[]>;

  constructor(
    private _requestedProjectService:RequestedProjectService
  )
  {
    this.layersSubject = new BehaviorSubject([]);
    
    this.layer$ = this.layersSubject.asObservable();
    
    this.projectedLayer$ = this.layersSubject.asObservable().pipe(
      map(
        layers => layers.filter(layer => layer.projected)
      )
    );
  }

  get modules():Module[]
  {
    return this._modules;
  }
 
  get projectedLayers():GisLayer[]
  {
    return this.layers.filter(layer => layer.projected);
  }

  get layers():GisLayer[]
  {
    return this.layersSubject.getValue();
  }

  public setMap(map:Map)
  {
    this.map = map;
  }

  public setModuleLayers(modules:Module[])
  {
    this._modules = modules;

    const layers = [];

    for( let module of modules)
    {
      for( let group of module.groups_with_active_gis_layers)
      {
        group.gis_layers = group.active_gis_layers.map(layer => {

          layer['module_id'] = module.id;
          
          layer['label'] = `<img title='${module.display_name}' src='assets/icons/svg/map/${module.name}-on.svg' class='icon me-2'> <b>${group.display_name}</b>`;

          const gisLayer = new GisLayer(
            layer,
            this._requestedProjectService.geoserverUrl,
            this.map
          );
  
          if( layers.length < 10 )
            gisLayer.add();
  
          layers.push(gisLayer);

          return gisLayer;

        })
      }
    }

    this.next(layers);
  }

  public next(layers?:GisLayer[]):void
  {
    this.layersSubject.next(layers ?? this.layers);
  }

  public find(key:string|number):GisLayer
  {
    return this.layers.find(layer => layer[typeof key === "string" ? 'name' : "id"] === key);
  }

  public clear():void
  {
    this.map = null;
    this._modules = [];
    this.next(null);
  }
}
