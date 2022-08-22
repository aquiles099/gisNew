import { Component, } from '@angular/core';
import { Polyline, LatLngExpression, LatLngBoundsExpression, ZoomPanOptions } from 'leaflet';
import { Geometry } from '@turf/helpers';
import LeafletWms from 'leaflet.wms';
import { BaseToolComponent } from '../../base-tool/base-tool.component';
import { ToolService } from '../../../../../../../services/gis/map/tool.service';
import { MapService } from '../../../../../../../services/gis/map/map.service';

@Component({
  templateUrl: './layer-highlighter.component.html',
  styleUrls: ['./layer-highlighter.component.scss']
})
export class LayerHighlighterComponent extends BaseToolComponent
{
  protected highlightLayer:LeafletWms.Overlay;

  constructor(
    protected toolService:ToolService,
    protected mapService:MapService
  )
  {
    super(
      toolService,
      mapService        
    );
  }

  protected createAndProject():void
  {
    this.highlightLayer = new LeafletWms.overlay(
      this.mapService.requestedProjectService.geoserverUrl,
      ({
      layers: null,
      styles: "highlighted",
      className: null,
      format: 'image/png',
      crossOrigin: true,
      transparent: true,
      opacity: 1,
      maxNativeZoom: 22,
      maxZoom: 22,
      tiled: false,
      cql_filter: null,
      env: "buffer:30",
    } as any));

    this.map.addLayer(this.highlightLayer);

    this.highlightLayer.bringToBack();
  }

  protected setLayerToHighlight(geoserverLayerKey:string):void
  {
    this.highlightLayer.setParams({
      layers: geoserverLayerKey,
      fake: Date.now()
    });
  }

  public highlight(query:string, zone?:{geom:Geometry|LatLngBoundsExpression, zoom?:number, options?:ZoomPanOptions}):void
  {
    this.highlightLayer.wmsParams.cql_filter = query;
    this.refresh();

    if( zone )
    {
      if( ! zone.options )
        zone.options = {duration: .5};
      
      switch( true )
      {
        case (zone.geom as Geometry).type === "Point":
          this.map.flyTo( ((zone.geom as Geometry).coordinates.reverse() as LatLngExpression), zone.zoom ?? 20, zone.options);
          break;

        case (zone.geom as Geometry).type !== "Point":

        const layer = new Polyline((zone.geom as Geometry).coordinates as LatLngExpression[]);

          let bounds = layer.getBounds()
                            .toBBoxString()
                            .split(',')
                            .map(pointInString => Number.parseFloat(pointInString));

          let bbox = [
            [bounds[0], bounds[1]],
            [bounds[2], bounds[3]]
          ];
          
          this.map.flyToBounds( (bbox as LatLngBoundsExpression) );
          break;

        default:
          this.map.flyToBounds((zone.geom as LatLngBoundsExpression));
          break;
      }
    };
  }

  protected attenuate():void
  {
    this.highlightLayer.setParams({
      layers: null
    });

    delete this.highlightLayer.wmsParams.cql_filter;

    this.highlightLayer.remove();
    
    this.map.addLayer(this.highlightLayer);
  }

  protected refresh():void
  {
    this.highlightLayer.setParams(({fake: Date.now()} as any));
  } 
}
