import { Component, OnInit,ElementRef  } from '@angular/core';
import {GisLayerService} from '../../../../../../services/gis/gis-layer.service'
import {GisLayer} from '../../../../../../models/gis-layer'
import {MapLayerService} from '../../../../../../services/gis/map/map-layer.service'
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../../../../services/spinner.service';
import { of } from 'rxjs';


@Component({
  templateUrl: './feature-labeling.component.html',
  styleUrls: ['./feature-labeling.component.scss',
  '../../../../../../../styles/map/tool.scss'

]
})
export class FeatureLabelingComponent 
{
  public attributes: any = [];
  public search: string = null;
  public layer: GisLayer;
  public selected_value: any = [];
  public selected_attribute_value: string;
  public showSpinner: boolean;

  constructor
  (
    private _gisLayerService:GisLayerService,
    private _mapLayerService:MapLayerService,
    private _toastService:ToastrService,
    private _spinnerService:SpinnerService,
    private elRef:ElementRef


    ) {


  }

  public async onChangeLayerSelector(layer: GisLayer): Promise<void> {

    try {
      this.showSpinner = true;
      this.layer = layer;
      this.selected_attribute_value = this.layer.getLabel()

      this.attributes = await this._gisLayerService.getAllowedAttributesPerTool(layer.id);

    }
    catch (error) {
      this.attributes = [];
    }
    finally {
      this.search = null;
      this.showSpinner = false;

    }
  }

  onChangeAttribute(event) {

    let checkbox_attributes = this.elRef.nativeElement.getElementsByClassName('checkbox_attribute') 

    let current_value=event.target.value;
    
    let is_checked=event.target.checked;

    for (const checkbox of checkbox_attributes) 
    {
      if(current_value!=checkbox.value)
      {
        checkbox.checked=false;
      }
      
    }
    
    this.selected_value=event.target.value;


    if(is_checked)
    {
      this.layer.addLabel(this.selected_value);

    }else
    {
      this.remove();

    }

  }


 remove()
 {

  let checkbox_attributes = this.elRef.nativeElement.getElementsByClassName('checkbox_attribute') 
 
  for (const checkbox of checkbox_attributes) 
  {
   
    if(checkbox.value==this.layer.getLabel())
    {
      checkbox.checked=false;
    }
    
  }

  this.layer.removeLabel();


 }

 removeAll()
 {

  let checkbox_attributes = this.elRef.nativeElement.getElementsByClassName('checkbox_attribute') 
 
  for (const checkbox of checkbox_attributes) 
  {
    checkbox.checked=false;


  }


  for(let layer of this._mapLayerService.projectedLayers)
  {
    layer.removeLabel();

  }

 
  }

}
