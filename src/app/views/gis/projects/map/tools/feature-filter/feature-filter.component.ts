import { Component, OnInit } from '@angular/core';
import { BaseToolComponent } from '../base-tool/base-tool.component';
import { ToolService } from '../../../../../../services/gis/map/tool.service';
import { MapService } from '../../../../../../services/gis/map/map.service';
import { GisLayerService } from '@services/gis/gis-layer.service';
import { GisLayer } from '../../../../../../models/gis-layer';
import { MapLayerService } from '@services/gis/map/map-layer.service';
import { LayerAttribute } from '../../../../../../interfaces/layer-attribute';

@Component({  templateUrl: './feature-filter.component.html',
  styleUrls: [
    './feature-filter.component.scss',
   '../../../../../../../styles/map/tool.scss'
]
})
export class FeatureFilterComponent extends BaseToolComponent implements OnInit
{
  public atributes:LayerAttribute[] = null;
  public selectedLayer:GisLayer;
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
  
  ngOnInit(): void
  {
    this.isThereAnyLayerWithActiveFilter = this._mapLayerService.projectedLayers.length > 0;
  }

  async onChangeLayerSelector(layer: GisLayer)
  {
    try
    {
      this.showSpinner = true;
      this.selectedPropertyData = [];
      this.propertyValues = null;
      this.formData.property= [];
      this.selectedLayerFilter = null;
  
      this.selectedLayer = layer;
  
      if(layer)
      {
        this.formData.layer = layer;
        this.atributes = await this._gisLayerService.getAllowedAttributesPerTool(this.selectedLayer.id);
        this.selectedLayerFilter = layer.filter;
      }
      else
      {
        this.atributes = null;
      }

    }
    catch(err) {
     console.log(err);
     this.showSpinner = false;
    }
    finally
    {
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

  public onChangePropertySelector():void
  {
    this.selectedPropertyData = this.atributes.find(property => property.name === this.formData.property);
    this.propertyValues = this.selectedPropertyData.domain || [];
    this.search = null;
  }

  public async removeFilterOnProperty():Promise<void>
  { 
    this.selectedLayer.clearFilter();
    this.selectedPropertyData = [];
    this.propertyValues = null;
    this.formData.property= null;  
    this.selectedLayerFilter = this.selectedLayer.filter;     
  }

  public selectedLayerHasFilterOnProperty():boolean
  {  
    return this.selectedLayerFilter && Object.keys(this.selectedLayerFilter).length  ?
    this.selectedLayer.hasFilterOnSomeAttribute() :
    false;
  }

  public async removeFilterOnAllLayers():Promise<void>
  {
    for(let layer of this._mapLayerService.projectedLayers)
      layer.clearFilter();
    
      this.selectedLayer = null;
      this.atributes = null;
      this.selectedPropertyData = [];
      this.propertyValues = null;
      this.formData.property= null;
      this.layerId = null;
      this.selectedLayerFilter = null;
  }
}
