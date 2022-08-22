import { Component, OnInit, NgZone } from '@angular/core';
import { LatLng, DomUtil } from 'leaflet';
import { ToolService } from '../../../../../../../services/gis/map/tool.service';
import { MapService } from '../../../../../../../services/gis/map/map.service';
import { FeatureService } from '../../../../../../../services/gis/map/feature.service';
import { LayerHighlighterComponent } from '../layer-highlighter/layer-highlighter.component';
import { Feature } from '@turf/helpers';
import { MapLayerService } from '../../../../../../../services/gis/map/map-layer.service';

@Component({
  templateUrl: './feature-finder.component.html',
  styleUrls: ['./feature-finder.component.scss']
})
export class FeatureFinderComponent extends LayerHighlighterComponent implements OnInit {

  private getFeatures: (event:any) => void = async event => 
  {
    this.ngZone.run( async () => {

      try
      {
        this.showSpinner = true;

        this.map.off("click", this.getFeatures);

        this.mapService.disableEvents();

        const latlng:LatLng = event.latlng;

        const point = {
          type: "Point",
          coordinates: [latlng.lng, latlng.lat]
        };
        
        const data = await this.featureService.getOfProjectedLayers(point);

        this.selectedFeature = null;

        this.setLayersWithFeatures(data);

        this.startCallback();

        // this.showingInfo = false;

        this.attenuate();
          
        if( this.thereIsOnlyOneFeature() )
        {
          this.onSelectFeature(this.layerFeatures[0]);
          
          // if( this.layerFeatures[0].layer === "centro_mando" )
          // {
          //   // mostrando herramienta de centro de mando...
          // }
        }

      }
      catch (error)
      {
      }
      finally
      {
        if( this.toolService.thereIsAnEnabledTool && this.toolService.enabledTool.name === this.getKey() )
          this.map.on("click", this.getFeatures);

        this.mapService.enableEvents();

        this.showSpinner = false;
        
        this.endCallback();

      }
    });
  };

  public layerFeatures:{layer_id:number, display_name:string, features:Feature<any>[]}[] = [];
  public selectedFeature:any;

  protected startCallback: () => any;
  protected endCallback: () => any;

  protected startSearchOnInit:boolean = false;

  constructor(
    protected toolService:ToolService,
    protected mapService:MapService,
    protected featureService:FeatureService,
    protected mapLayerService:MapLayerService,
    protected ngZone:NgZone,
  )
  {
    super(
      toolService,
      mapService
    )
  }

  public ngOnInit(): void
  {
    if( this.startSearchOnInit )
      this.enableSearch();
      
    this.createAndProject();
  }

  public ngOnDestroy(): void
  {
    this.disableSearch();
    this.highlightLayer.remove();
  }

  public enableSearch():void
  {
    this.map.on("click", this.getFeatures);
    this.map.doubleClickZoom.disable(); 
    DomUtil.addClass(this.map.getContainer(), 'cursor-help');
  }

  public disableSearch():void
  {
    this.map.doubleClickZoom.enable(); 
    this.map.off("click", this.getFeatures);
    DomUtil.removeClass(this.map.getContainer(), 'cursor-help');
  }

  public setLayersWithFeatures(data:{[layerName:string]:{layer_id:number, display_name:string, features:Feature<any>[]}})
  {
    this.layerFeatures = [];

    for( let _data of Object.values(data) )
      if( _data.features.length )
        this.layerFeatures.push(_data);
  }
  
  public thereIsOnlyOneFeature():boolean
  {
    let value = false;

    if( this.layerFeatures.length === 1 )
      if( this.layerFeatures[0].features.length === 1 )
        value = true;

    return value;
  }

  public onSelectFeature(data:{layer_id:number, display_name:string, features:Feature<any>[]}):void
  {
    this.selectedFeature = data.features[0];

    const gisLayer  = this.mapLayerService.find(data.layer_id); 
    
    this.setLayerToHighlight(gisLayer.geoserverKey);

    this.highlight(`id = ${this.selectedFeature.id}`, {geom: this.selectedFeature.geom});
  }
}
