import { Component, OnInit, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';
import { GisLayer } from '@models/gis-layer';
import { Marker, Polygon, Polyline } from 'leaflet';
import { BaseToolComponent } from '../../base-tool/base-tool.component';
import { ToolService } from '../../../../../../../services/gis/map/tool.service';
import { MapService } from '../../../../../../../services/gis/map/map.service';

@Component({
  templateUrl: './draw-layer.component.html',
  styleUrls: ['./draw-layer.component.scss']
})
export class DrawLayerComponent extends BaseToolComponent implements OnInit, OnDestroy {

  public gisLayer:GisLayer = null;

  public newLayer:Marker|Polyline|Polygon;
  
  public newFeature:{[key:string]:string|number|boolean} = {};

  public drawingState:"waiting"|"inProgress"|"finished" = "waiting";

  public finishMultiGeometry:boolean = false;

  public helpMessage:string = null;

  private updateHelpText:(event:any) => void = (e) => {
    
    if( this.gisLayer.geometry_type !== "POINT" )
    {
      const isAPolygon = this.gisLayer.geometry_type.includes("POLYGON");

      e.layer.editor._drawnLatLngs.length + 1 < e.layer.editor.MIN_VERTEX ?
      this.helpMessage = `Click para continuar ${ isAPolygon ? "polígono" : "línea" }.` :
      this.helpMessage = `Click en último punto para terminar ${ isAPolygon ? "polígono" : "línea" }.`;
    }
  };

  private onDrawingALayer: (event:any) => Promise<void> = async event => 
  {
    this.ngZone.run(async () => {

      // if( this.gisLayer.filtro_capa === "gissmart_energy#gestlighting#centro_mando" )
      // {
      //   await this._showCommandCenterManagementTool();
      //   return;
      // }
      
        if( this.gisLayer.geometry_type.includes("MULTI") && this.drawingState === "inProgress" )
        {
          setTimeout(() => {

              (this.newLayer as any).editor.newShape();

              this.finishMultiGeometry = true;
              
              this.helpMessage = this.gisLayer.geometry_type.includes('POLYGON') ? `
                              Click en mapa para iniciar nuevo polígono. <br> 
                              Click sobre polígono para iniciar agujero. <br>
                              ` :
                              `Click en mapa para iniciar nueva línea.`;

            }, 200);
        }
        else
        {
          this.drawingState = "finished";

          this.newLayer.disableEdit();

          this.helpMessage = this.gisLayer.geometry_type.includes('POLYGON') ? 
          `<kdb>Ctrl + click</kdb> sobre polígono para iniciar agujero.`: "";

          this.onFinishDrawing();

          this.focusOnDrawedLayer();

        }

        this.finishMultiGeometry = false;
    });
  };

  protected onFinishDrawing:() => void;

  protected zoomBeforeFocusOnLayer:number;

  constructor(
    protected toolService:ToolService,    
    protected mapService:MapService,    
    protected ngZone:NgZone
  )
  {
    super(
      toolService,    
      mapService,
    );
  }

  get drawing():boolean
  {
    return this.map.editTools.drawing();
  }

  public ngOnInit():void
  {
    this.map.on('editable:drawing:click', this.updateHelpText);
    this.map.on('editable:drawing:cancel', () => this.finishMultiGeometry = false);
    this.map.on("editable:drawing:commit", this.onDrawingALayer);
    this.map.doubleClickZoom.disable(); 
  }

  public ngOnDestroy():void
  {  
    this.map.off('editable:drawing:click', this.updateHelpText);
    this.map.off('editable:drawing:cancel', () => this.finishMultiGeometry = false);
    this.map.off("editable:drawing:commit", this.onDrawingALayer);
    this.map.doubleClickZoom.enable(); 
    this.clear();
  }

  public startDrawing():void
  {    
    switch( this.gisLayer.geometry_type )
    {
      case "POINT":
        this.newLayer = this.map.editTools.startMarker();
        this.helpMessage = "Click en mapa para agregar marcador.";
        break;

      case "LINESTRING":
      case "MULTILINESTRING":
        this.newLayer = this.map.editTools.startPolyline();
        this.helpMessage = "Click en mapa para iniciar línea.";
        break;

      case "POLYGON":
      case "MULTIPOLYGON":

        this.newLayer = this.map.editTools.startPolygon();
        
        // evento para iniciar agujero sobre poligono una vez que este es dibujado.
        this.newLayer.on('click', (event:any) => {

          if ((event.originalEvent.ctrlKey || event.originalEvent.metaKey) &&
             (this.newLayer as any).editEnabled() &&
             this.gisLayer.geometry_type !== "MULTIPOLYGON"
            )
            {
              (this.newLayer as any).editor.newHole(event.latlng);
            }

        });

        this.helpMessage = "Click en mapa para iniciar polígono.";

        break;
    }

    this.drawingState = "inProgress";
  }

  public finishMultipleGeometryFeature():void
  {
    this.ngZone.run(() => {

      this.map.editTools.stopDrawing();
      this.drawingState = "finished";  
      this.newLayer.disableEdit();
      this.helpMessage = null;
      this.focusOnDrawedLayer();

    });

    this.onFinishDrawing();
  }

  public focusOnDrawedLayer():void
  {
    this.zoomBeforeFocusOnLayer = this.map.getZoom();

    this.newLayer instanceof Marker ?
    this.map.flyTo( this.newLayer.getLatLng(), 20, {duration: .5}) :
    this.map.flyToBounds( this.newLayer.getBounds() );
  }

  public async clear():Promise<void>
  {
    this.map.editTools.stopDrawing();

    if( this.newLayer )
    {
      this.newLayer.remove();
      this.newLayer = null;
      this.newFeature = {};

      if( this.zoomBeforeFocusOnLayer )
      {
        this.map.setZoom(this.zoomBeforeFocusOnLayer);
        this.zoomBeforeFocusOnLayer = null;
      }
    }

    this.drawingState = "waiting";
    
    this.helpMessage = null;
  }
}
