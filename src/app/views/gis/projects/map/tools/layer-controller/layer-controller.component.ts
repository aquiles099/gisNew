import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { tileLayer, TileLayer } from 'leaflet';
import { MapLayerService } from '../../../../../../services/gis/map/map-layer.service';
import { GisLayer } from '../../../../../../models/gis-layer';
import { Subscription } from 'rxjs';
import { ToolService } from '../../../../../../services/gis/map/tool.service';
import { fadeInRightOnEnterAnimation, fadeOutRightOnLeaveAnimation } from 'angular-animations';

interface ModuleData
{
  collapsed:boolean;
  projected:boolean;
  data:{
    id:number;
    name:string;
    display_name:string;
    groups: GroupData[]
  }
}

interface GroupData
{
  collapsed:boolean;
  projected:boolean;
  data:{
    id:number;
    name:string;
    display_name:string;
    layers: LayerData[]
  }
}

interface LayerData
{
  collapsed:boolean;
  data:GisLayer
}

interface BaseLayerData
{
  key:string;
  name:string;
  layer:TileLayer
}

@Component({
  selector: 'layer-controller',
  templateUrl: './layer-controller.component.html',
  styleUrls: ['./layer-controller.component.scss'],
  animations: [
    fadeInRightOnEnterAnimation({duration: 500}),
    fadeOutRightOnLeaveAnimation({duration: 500}),
  ]
})
export class LayerControllerComponent implements OnInit, OnDestroy
{
  public modules:ModuleData[] = [];

  private _isVisible:boolean = false;

  @Output()
  public onChangeBaseLayer:EventEmitter<TileLayer> = new EventEmitter;

  public selectedBaseLayerKey:string = 'osm';

  private mapLayerServiceSubscription:Subscription;
  private toolServiceSubscription:Subscription;

  public baseLayers: BaseLayerData[] = [
    {
      key:"osm",
      name:"OSM",
      layer: tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        crossOrigin: 'anonymous',
        className: 'OSM',
        maxNativeZoom: 19,
        maxZoom: 22,
        minZoom: 5
      })
    },
    {
      key:"google_maps",
      name:"Google maps",
      layer:  tileLayer("https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}", {
        className: 'Google maps',
        maxNativeZoom: 22,
        maxZoom: 22,
        minZoom: 5
      })
    },
    {
      key:"google_satelite",
      name:"Google satelite",
      layer: tileLayer("https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
        className:'Google satelite',
        maxNativeZoom: 22,
        maxZoom: 22,
        minZoom: 5
      })
    },
    {
      key:"pnoa",
      name:"PNOA",
      layer:  tileLayer.wms("https://www.ign.es/wms-inspire/pnoa-ma?", {
        className: 'PNOA',
        layers: 'OI.OrthoimageCoverage',
        maxNativeZoom: 22,
        maxZoom: 22,
        minZoom: 5,
        format: 'image/png',
        transparent: true
      })
    },
    // {
    //   key:"idena",
    //   name:"IDENA",
    //   layer:tileLayer.wms("https://idena.navarra.es/ogc/wms", {
    //     className: 'Idena',
    //     layers: 'IDENA:ortofoto_500_Pamplona_2020',
    //     maxNativeZoom: 22,
    //     maxZoom: 22,
    //     minZoom: 5,
    //     format: 'image/png',
    //     transparent: true
    //   })
    // },
    {
      key:"catastro",
      name:"Catastro",
      layer: tileLayer.wms("http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx", {
        className: 'Catastro',
        layers: 'Catastro',
        maxNativeZoom: 22,
        maxZoom: 22,
        minZoom: 5,
        format: 'image/png',
        transparent: true
      })
    } 
  ];

  constructor(
    private _mapLayerService:MapLayerService,
    private _toolService:ToolService
  ) { }

  get isVisible():boolean
  {
    return this._isVisible;
  }

  public ngOnInit(): void
  {
    this.mapLayerServiceSubscription =  this._mapLayerService.layer$.subscribe(layers => {

      if( layers.length )
      {
        let i = 0;

        for(let module of this._mapLayerService.modules)
        {
            const moduleData = {
              collapsed: i !== 0,
              projected: i === 0,
              data: {
                id: module.id,
                name: module.name,
                display_name: module.display_name,
                groups:[]
              }
            };

            for(let group of module.groups_with_active_gis_layers)
            {
              const groupData:GroupData = {
                collapsed: i === 0,
                projected: i === 0,
                data: {
                    id: group.id,
                    name: group.name,
                    display_name: group.display_name,
                    layers: []
                }
              };

              for(let layer of group.gis_layers)
              {
                 const layerData:LayerData = {
                    collapsed: true,
                    data: layer
                  };

                  groupData.data.layers.push(layerData);
              }

              moduleData.data.groups.push(groupData);
            }

            this.modules.push(moduleData);

            i++;
        }
      }
        
    });

    const osmLayer = this.baseLayers.find(layer => layer.key === 'osm');
    
    this.onChangeBaseLayer.emit(osmLayer.layer);

    this.toolServiceSubscription = this._toolService.enabledToolObservable.subscribe(tool => {

      if( tool && this.isVisible )
        this.toggleVisibleState();

    });
  }

  public ngOnDestroy(): void
  {
    this.mapLayerServiceSubscription.unsubscribe();  
    this.toolServiceSubscription.unsubscribe();  
  }

  public toggleVisibleState():void
  {
    this._isVisible = ! this._isVisible;
  }

  public toggleCollapseStateOnModuleContent(module:ModuleData):void
  {
    if( module.collapsed )
    {
      this.modules.forEach(_module => {
        if( module.data.name !== _module.data.name )
          _module.collapsed = true;
      });
    }

    module.collapsed = ! module.collapsed;
  }
 
  public toggleCollapseStateOnGroupContent(group:GroupData, module:ModuleData):void
  {
    if( group.collapsed )
    {  
      module.data.groups.forEach(_group => {
        if( group.data.id !== _group.data.id )
          _group.collapsed = true;
      });
    }

    group.collapsed = ! group.collapsed;
  }
  
  public toggleCollapseStateOnLayerContent(layer:LayerData, group:GroupData):void
  {
    if( layer.collapsed )
    {
      group.data.layers.forEach(_layer => {
        if( layer.data.id !== _layer.data.id )
          _layer.collapsed = true;
      });
    }

    layer.collapsed = ! layer.collapsed;
  }

  public onLayerLegendImageImage(imgContainer:HTMLElement, spinnerContainer:HTMLElement):void
  {
    spinnerContainer.remove();
    imgContainer.classList.remove("d-none");
  }

  public toggleProjectedStateinLayer(layer:LayerData, group:GroupData, module:ModuleData):void
  {
    layer.data.projected ? layer.data.remove() : layer.data.add();

    group.projected = group.data.layers.some(layer => layer.data.projected);

    module.projected = module.data.groups.some(group => group.projected);
  }
 
  public toggleProjectedStateinGroup(group:GroupData, module:ModuleData):void
  {
    group.data.layers.forEach(layer => group.projected ? layer.data.remove() : layer.data.add());

    group.projected = group.data.layers.some(layer => layer.data.projected);

    module.projected = module.data.groups.some(group => group.projected);
  }
  
  public toggleProjectedStateinModule(module:ModuleData):void
  {
    module.projected = ! module.projected;

    module.data.groups.forEach(group => {
      group.data.layers.forEach(layer => module.projected ? layer.data.add() : layer.data.remove() );
      group.projected = module.projected;
    });
  }

  public changeBaseLayer(data:BaseLayerData):void
  {
    this.selectedBaseLayerKey = data.key; 
    this.onChangeBaseLayer.emit(data.layer);
  }
}
