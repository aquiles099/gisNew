require("leaflet.path.drag/src/Path.Drag.js");
require("leaflet-editable/src/Leaflet.Editable.js");
// require("src/assets/fonts/Arial-jsPdf.js");

import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  Control,
  Draw,
  DrawEvents,
  drawLocal,
  DrawMap,
  featureGroup,
  FeatureGroup,
  GeometryUtil,
  icon,
  latLngBounds,
  LatLngExpression,
  Marker,
  TileLayer,
  Toolbar,
  Util,
  Polyline,
  Polygon,
  MapOptions,
  LatLngBounds, 
  tileLayer,
  Map,
  CRS} from 'leaflet';
import LeafletWms from "leaflet.wms";
// import { saveAs } from 'file-saver';
import { Observable, Observer, Subscription } from 'rxjs';
import Swal from "sweetalert2";
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation, fadeInRightOnEnterAnimation, fadeOutRightOnLeaveAnimation, fadeOutLeftOnLeaveAnimation, fadeInLeftOnEnterAnimation } from 'angular-animations';
import { delayExecution } from 'src/app/shared/helpers';
import { switchMap, catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthUserService } from '@services/auth-user.service';
import { RequestedProjectService } from '@services/requested-project.service';
import { SpinnerService } from '@services/spinner.service';
import { User } from "@models/user";
import { Project } from '../../../../interfaces/project';
import { MapService } from '../../../../services/gis/map/map.service';
import { GisTool } from '../../../../interfaces/gis-tool';
import { GisToolGroup } from '../../../../interfaces/gis-tool-group';
import { Module } from '../../../../interfaces/module';
import { Layer } from '../../../../interfaces/layer';
import { LayerControllerComponent } from './tools/layer-controller/layer-controller.component';
import { MapLayerService } from '../../../../services/gis/map/map-layer.service';
import { ToolService } from '../../../../services/gis/map/tool.service';

const DURACION_ANIMACION = 250;

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';

const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

Marker.prototype.options.icon = iconDefault;

@Component({
  templateUrl: "./map.component.html",
  styleUrls: ['./map.component.scss',
  '../../../../../styles/map/map.scss'
],
  animations: [
    fadeInRightOnEnterAnimation({duration: 500}),
    fadeOutRightOnLeaveAnimation({duration: 500})
  ]
})
export class MapComponent implements OnInit, AfterViewChecked, OnDestroy
{
  public map:Map;
  
  public resources:{
    projects:Partial<Project>[],
    toolsAndModules: {
      modules:Module[],
      tool_groups:GisToolGroup[]
    }
  };

  public activatedToolSubscription:Subscription;
  public routeDataSubscription:Subscription;
  public options: MapOptions;
  public drawOptions: any;
  public leafletDrawLayer: FeatureGroup = featureGroup();
  
  // 

  @ViewChild(LayerControllerComponent)
  public LayerController:LayerControllerComponent;

  public activatedTool:GisTool;

  public baseLayer:TileLayer;

  public showSpinner:boolean = false;

  constructor(
    private _mapService: MapService,
    private _toolService: ToolService,
    private _toastrService:ToastrService,
    private _spinnerService: SpinnerService,
    private router: Router,
    private _requestedProjectService:RequestedProjectService,
    private _authUserService:AuthUserService,
    private _mapLayerService:MapLayerService,
    private route:ActivatedRoute,
    private _changeDetectorRef:ChangeDetectorRef
  ) {

    this.options = {
      zoom: 17,
      zoomControl: false,
      center: [40.395347, -3.694041],
      editable: true,
      preferCanvas: true,
      drawControl: false,
      attributionControl: false,
      crs: CRS.EPSG3857
    };
  }

  get authUser():User
  {
    return this._authUserService.user;
  }

  get project():Project
  {
    return this._requestedProjectService.project;
  }

  get thereIsAnEnabledTool():boolean
  {
    return this._toolService.thereIsAnEnabledTool;
  }
 
  public ngOnInit(): void
  {
    this._toolService.goToBaseUrl();
    this.routeDataSubscription = this.route.data.subscribe((data:any) => this.resources = data['resources']);
  }
  
  public ngAfterViewChecked(): void
  {  
   this._changeDetectorRef.detectChanges();
  }

  public ngOnDestroy():void
  {
    this._mapService.clear();
    this._mapLayerService.clear();
    this._toolService.clear();
    this.routeDataSubscription.unsubscribe();
  }

  public onMapReady(map:Map):void
  {
    try
    {              
      map.fitBounds( (this._requestedProjectService.bbox as any) );

      const municipalityOutlineLayer = LeafletWms.overlay(this._requestedProjectService.geoserverUrl, {
        layers: "municipality",
        format: 'image/gif',
        crossOrigin: true,
        transparent: true,
        opacity: 1,
        maxNativeZoom: 22,
        maxZoom: 22,
        tiled: false,
        cql_filter: `id=${this.project.municipality.id}`
      });

      map.addLayer(municipalityOutlineLayer);

      map.addLayer(this.leafletDrawLayer);

      this._mapLayerService.setMap(map);

      this._mapLayerService.setModuleLayers(this.resources.toolsAndModules.modules);
      
      this._mapService.next(map);

      // this._mapService.baseLayer = this.baseLayer;

      this.map = map;

    }
    catch (error)
    {
      console.error(error);
    }
  }

  public changeBaseLayer(layer:TileLayer): void
  {
    this.baseLayer = layer;
    this._mapService.baseLayer = layer;
  }
}
