import { Component, OnInit } from '@angular/core';
import { BaseToolComponent } from '../base-tool/base-tool.component';
import { ToolService } from '../../../../../../services/gis/map/tool.service';
import { MapService } from '../../../../../../services/gis/map/map.service';
import { GisLayerService } from '@services/gis/gis-layer.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { GisLayer } from '../../../../../../models/gis-layer';
import { isNumeric, isset } from '../../../../../../shared/helpers';

@Component({  templateUrl: './feature-filter.component.html',
  styleUrls: ['./feature-filter.component.scss']
})
export class FeatureFilterComponent extends BaseToolComponent 
{
  public attributes:any=[];
  public selectedLayer:GisLayer;
  public projectLayersSubscription: Subscription;
  public search:string = null;
  public propertyValues:Array<string|number> = [];
  public selectedLayerFilter:{[atributo:string]:Array<string|number>};
  private selectedPropertyData:any;
  public formData:any = {
    module:null,
    group:null,
    layer:null,
    property:null
  };
  public properties:Array<any> = [];
  public apiData:any;
  constructor(
    protected toolService:ToolService,
    protected mapService:MapService,
    private _gisLayerService:GisLayerService
  )
  {
    super(
      toolService,
      mapService
    );

    this.key = "feature-filter";
  }

  async onChangeLayerSelector(layer: GisLayer)
  {
    if(layer) {
      this.selectedLayer = layer;
      this.formData.layer = layer;
      this.attributes = await this._gisLayerService.getAllowedAttributesPerTool(this.selectedLayer.id);
      this.selectedLayerFilter = layer.filterMap;
      console.log(this.selectedLayerFilter);
      
      if(this.attributes.length < 1){
        Swal.fire({
          icon: "info",
          title: "Error",
          text: "Debe configurar algún atributo para esta herramienta.",
          confirmButtonText: "OK",
          heightAuto: false
        });
      }
    }
    else
    {
      this.selectedLayer = null;
      this.attributes = [];
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
    console.log(this.formData);
    this.selectedPropertyData = this.attributes.find(property => property.name === this.formData.property);
    console.log(this.selectedPropertyData);
    this.propertyValues = this.selectedPropertyData.domain;
    this.search = null;
  }


}
