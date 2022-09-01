import { Component, OnInit, NgZone } from '@angular/core';
import { FeatureFinderComponent } from '../feature-finder/feature-finder.component';
import { Feature } from '@turf/helpers';
import { GeoJSONHelper } from '../../../../../../../models/gis/geojson-helper';
import { Marker, Polyline, Polygon } from 'leaflet';
import { GisLayer } from '../../../../../../../models/gis-layer';
import { ToolService } from '../../../../../../../services/gis/map/tool.service';
import { MapService } from '../../../../../../../services/gis/map/map.service';
import { FeatureService } from '../../../../../../../services/gis/map/feature.service';
import { MapLayerService } from '../../../../../../../services/gis/map/map-layer.service';

@Component({
  templateUrl: './move-feature.component.html',
  styleUrls: ['./move-feature.component.scss']
})
export class MoveFeatureComponent extends FeatureFinderComponent implements OnInit {

  public gisLayer:GisLayer = null;

  public editableLayer:Marker|Polyline|Polygon;

  public helpMessage:string = null;

  protected zoomBeforeFocusOnLayer:number;

  constructor(
    protected toolService:ToolService,
    protected mapService:MapService,
    protected featureService:FeatureService,
    protected mapLayerService:MapLayerService,
    protected ngZone:NgZone
  )
  {
    super(
      toolService,
      mapService,
      featureService,
      mapLayerService,
      ngZone
    );
  }

  get drawing():boolean
  {
    return this.editableLayer?.drawing();
  }

  public ngOnDestroy():void
  {  
    super.ngOnDestroy();
    this.clear();
  }

  public startDrawing(feature:Feature<any>):void
  {      
      const geometry = (feature as any).geom;

      GeoJSONHelper.invertGeometryCoordinates(geometry);

      switch( geometry.type )
      {
        case "Point":
          this.editableLayer = new Marker((geometry.coordinates as any)).addTo( this.map );
          this.helpMessage = "Mueva el elemento a la posición deseada.";
          break;

        case "LineString":
        case "MultiLineString":
          this.editableLayer = new Polyline( (geometry.coordinates as any) ).addTo( this.map );
          this.helpMessage = "Mueva el elemento o sus vertices a la posición deseada.";
          break;

        case "Polygon":
        case "MultiPolygon":
          this.editableLayer = new Polygon((geometry.coordinates as any) ).addTo( this.map );

          this.editableLayer.on('click', (event:any) => {

            if ((event.originalEvent.ctrlKey || event.originalEvent.metaKey) && this.editableLayer.editEnabled())
              (this.editableLayer as any).editor.newHole(event.latlng);

          });

          this.helpMessage = "Mueva el elemento o sus vertices a la posición deseada. <br><br> Presione <kdb>Ctrl</kdb> + click sobre polígono para iniciar agujero.";
          
          break;
      }

      this.editableLayer.enableEdit();

    this.map.off("click", this.getFeatures);
  }

  public async clear():Promise<void>
  {
    if( this.editableLayer )
    {
      this.editableLayer.remove();
      this.editableLayer = null;

      if( this.zoomBeforeFocusOnLayer )
      {
        this.map.setZoom(this.zoomBeforeFocusOnLayer);
        this.zoomBeforeFocusOnLayer = null;
      }

      this.map.on("click", this.getFeatures);
    }
    
    this.helpMessage = null;
  }

}