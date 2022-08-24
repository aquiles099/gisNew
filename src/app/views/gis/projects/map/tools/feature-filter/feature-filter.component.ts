import { Component, OnInit } from '@angular/core';
import { BaseToolComponent } from '../base-tool/base-tool.component';
import { ToolService } from '../../../../../../services/gis/map/tool.service';
import { MapService } from '../../../../../../services/gis/map/map.service';
import { GisLayerService } from '@services/gis/gis-layer.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { GisLayer } from '../../../../../../models/gis-layer';
import { MapLayerService } from '@services/gis/map/map-layer.service';

@Component({  templateUrl: './feature-filter.component.html',
  styleUrls: ['./feature-filter.component.scss']
})
export class FeatureFilterComponent extends BaseToolComponent implements OnInit
{
  public attributes:any=[];
  public selectedLayer:GisLayer;
  public projectLayersSubscription: Subscription;
  public search:string = null;
  public propertyValues:Array<string|number> = [];
  public selectedLayerFilter:{[atributo:string]:Array<string|number>};
  private selectedPropertyData:any;
  public layerId:number;
  public formData:any = {
    module:null,
    group:null,
    layer:null,
    property:null
  };
  public properties:Array<any> = [];
  public apiData:any;
  public isThereAnyLayerWithActiveFilter:boolean = false;
  constructor(
    protected toolService:ToolService,
    protected mapService:MapService,
    private _gisLayerService:GisLayerService,    
    private _mapLayerService:MapLayerService
  )
  {
    super(
      toolService,
      mapService
    );

    this.key = "feature-filter";
  }
  
  ngOnInit(): void {
    this.isThereAnyLayerWithActiveFilter = this._mapLayerService.projectedLayers.length > 0;
  }

  async onChangeLayerSelector(layer: GisLayer)
  {
    this.showSpinner = true;
    this.attributes = [];
    this.selectedPropertyData = [];
    this.propertyValues = null;
    this.formData.property= [];
    this.selectedLayerFilter = null;
    if(layer) {
      this.selectedLayer ? this.selectedLayer.clearFilter(): '';
      this.selectedLayer = layer;
      this.formData.layer = layer;
      this.attributes = await this._gisLayerService.getAllowedAttributesPerTool(this.selectedLayer.id);
      this.selectedLayerFilter = layer.filterMap;
      if(this.attributes.length < 1){
        Swal.fire({
          icon: "info",
          title: "Error",
          text: "Debe configurar algún atributo para esta herramienta.",
          confirmButtonText: "OK",
          heightAuto: false
        });
      }
      this.showSpinner = false;
    } else {
      this.selectedLayer = null;
      this.attributes = [];
      this.selectedPropertyData = [];
      this.formData.property= [];
      this.propertyValues = null;
      this.showSpinner = false;

    }
  }

  public async updateFilter(value:string|number):Promise<void>
  {
    this.selectedLayer.updateFilter(this.selectedPropertyData.name, value );
  }

  public valueExistsOnFilter(value:string|number):boolean
  {    
    return this.selectedLayerFilter[this.selectedPropertyData.name] ?
    this.selectedLayerFilter[this.selectedPropertyData.name].includes(value) :
    false;
  }

  public onChangePropertySelector():void {
    this.selectedPropertyData = this.attributes.find(property => property.name === this.formData.property);
    this.propertyValues = this.selectedPropertyData.domain || [];
    this.search = null;
  }

  public toggleSectionVisibility() {
    this.close();
  }

  public async removeFilterOnProperty():Promise<void>
  { 
    this.selectedLayerFilter[this.selectedPropertyData.name] = [];
    this.selectedLayer.clearFilter();
    this.formData.property= null;
    this.propertyValues = null;
    this.selectedPropertyData = [];
  }

  public selectedLayerHasFilterOnProperty():boolean
  {
    return this.selectedLayerFilter && Object.keys(this.selectedLayerFilter).length &&
    this.selectedLayerFilter[this.selectedPropertyData.name] ?
    this.selectedLayerFilter[this.selectedPropertyData.name].length > 0 :
    false;
  }

  public async removeFilterOnAllLayers():Promise<void>
  {
    for(let layer of this._mapLayerService.projectedLayers) {
      layer.clearFilter();
    }
    this.selectedLayer = null;
    this.attributes = [];
    this.selectedPropertyData = [];
    this.propertyValues = null;
    this.formData.property= null;
    this.layerId = null;
    this.selectedLayerFilter = null;
  }
}
