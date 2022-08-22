import { Injectable, OnDestroy } from '@angular/core';
import { DomUtil, LatLngBounds, Map, Rectangle, TileLayer } from 'leaflet';
import { BehaviorSubject, Observable } from 'rxjs';
import LeafletWms from 'leaflet.wms';
import { RequestedProjectService } from '../../requested-project.service';
import { GisTool } from '../../../interfaces/gis-tool';
import { Router } from '@angular/router';
import { MapLayerService } from './map-layer.service';

@Injectable()
export class MapService 
{
  private mapSubject: BehaviorSubject<Map>;
  public  mapObservable: Observable<Map>;

  public wmsLayersNotLoaded:number[] = [];

  public baseLayer:TileLayer|TileLayer.WMS;

  // public lastScreenshot:MapScreenshot;

  constructor(
    public requestedProjectService:RequestedProjectService,
    public mapLayerService:MapLayerService,
    private _router:Router
  )
  {
    this.mapSubject = new BehaviorSubject(null);
    this.mapObservable = this.mapSubject.asObservable();
  }

  get map():Map
  {
    return this.mapSubject.getValue();
  }

  public next(map:Map):void
  {
    // const baseTileLayers = this.getBaseLayers();

    // baseTileLayers.forEach(layer => {

    //   if( ! layer.listens("loading") && ! layer.listens("load"))
    //   { 
    //     layer.on({
    //       "loading": () => this.loadingWmsLayer( (layer as any)._leaflet_id ),
    //       "load": () => this.wmsLayerLoaded( (layer as any)._leaflet_id )
    //     });
    //   }

    // });
    
    // map.on("layerremove", event => {

    //   const layer = event.layer;
    //   const removedLayerIsABaseLayer = baseTileLayers.includes(layer);
      
    //   if( removedLayerIsABaseLayer  && (layer as TileLayer).isLoading() )
    //     this.wmsLayerLoaded( (layer as any)._leaflet_id );

    // });

    this.mapSubject.next(map);
  }
  public disableEvents():void
  {
    this.map.dragging.disable();
    this.map.touchZoom.disable();
    this.map.doubleClickZoom.disable();
    this.map.scrollWheelZoom.disable();
    this.map.boxZoom.disable();
    this.map.keyboard.disable();

    if (this.map.tap)
      this.map.tap.disable();

    DomUtil.addClass(this.map.getContainer(), 'cursor-default');
  }

  public enableEvents():void
  {
    this.map.dragging.enable();
    this.map.touchZoom.enable();
    this.map.doubleClickZoom.enable();
    this.map.scrollWheelZoom.enable();
    this.map.boxZoom.enable();
    this.map.keyboard.enable();

    if (this.map.tap)
      this.map.tap.enable();

    DomUtil.removeClass(this.map.getContainer(), 'cursor-default');
  }

  // public async getMapScreenshot(options?:any, saveScreenshotInstance:boolean = true, showOnly?:any[]):Promise<string>
  // {
  //   try
  //   {
  //     await this.waitForAllWMSLayersToLoad();

  //     const mapScreenshot = new MapScreenshot(this.map, this.baseLayer, options, showOnly);

  //     if( saveScreenshotInstance )
  //       this.lastScreenshot = mapScreenshot;

  //     return await mapScreenshot.fire();
  //   }
  //   catch (error)
  //   {
  //     throw error;
  //   }
  // }

  // public async getMapZoneScreenshot(options?:any):Promise<string>
  // {
  //   const currentZoom = this.map.getZoom();

  //   const rectangle = new Rectangle(this.map.getBounds(), {
  //     fill: false,
  //     weight: 6,
  //     color: "#120c8e"
  //   }).addTo(this.map);

  //   this.map.setZoom(currentZoom - 2.5);

  //   try
  //   {
  //     return await this.getMapScreenshot(options, false, [rectangle]);
  //   }
  //   catch (error)
  //   {
  //     throw error;
  //   }
  //   finally
  //   {
  //     this.map.setZoom(currentZoom);

  //     rectangle.remove();
  //   }
  // }

  // public async waitForAllWMSLayersToLoad():Promise<void>
  // {
  //   return new Promise<void>(resolve => {

  //     const checker = setInterval(() => {

  //       // console.log( this.wmsLayersNotLoaded );
        
  //       if( ! this.wmsLayersNotLoaded.length )
  //       {
  //         clearInterval(checker);
  //         resolve();
  //       }

  //     }, 1000);

  //   });
  // }

  // public async getGraphicScaleImage(options?:any):Promise<string>
  // {
  //   const htmlElement:HTMLElement = document.querySelector("div.leaflet-control-graphicscale");

  //   const _options = {
  //     allowTaint: true,
  //     useCORS: true,
  //     height: htmlElement.offsetHeight,
  //     width: htmlElement.offsetWidth,
  //     imageTimeout: 0
  //   };

  //   if( options )
  //     Object.assign(_options, options);

  //   if(htmlElement)
  //   {
  //     const canvas = await html2canvas(this.map.getContainer(), _options);
  //     return canvas.toDataURL();
  //   }
  // }

  public getScale(): number
  {
    const mapCenter = this.map.getSize().y / 2;

    const RealWorldMetersPer100Pixels = this.map.distance(
      this.map.containerPointToLatLng([0, mapCenter]),
      this.map.containerPointToLatLng([100, mapCenter])
    );

    let scale = RealWorldMetersPer100Pixels / 0.026556016597510376;

    scale = parseInt(scale.toString().split('.')[0]);

    switch (true) {
      case (scale < 125 && scale > 95):
        scale = 100;
        break;
      case (scale < 1050 && scale > 980):
        scale = 1000
        break;
      case (scale < 2050 && scale > 1080):
        scale = 2000
        break;
      case (scale < 5100 && scale > 4070):
        scale = 5000
        break;
      case (scale < 10100 && scale > 9070):
        scale = 10000
        break;
      case (scale < 50150 && scale > 40070):
        scale = 50000
        break;
      case (scale < 100170 && scale > 99050):
        scale = 100000
        break;
      case (scale < 255150 && scale > 249050):
        scale = 250000
        break;
      case (scale < 500500 && scale > 409050):
        scale = 500000
        break;
      case (scale < 1000170 && scale > 999050):
        scale = 1000000
        break;
      default:
        scale = Math.ceil(scale / 100) * 100;
        break;
    }

    return scale;
  }

  public loadingWmsLayer(id:number):void
  {
    this.wmsLayersNotLoaded.push(id);
  }

  public wmsLayerLoaded(id:number):void
  {
    this.wmsLayersNotLoaded = this.wmsLayersNotLoaded.filter(_id => _id !== id);
  }

  public clear():void
  {
    this.next(null);
    this.wmsLayersNotLoaded = [];
  }

}
