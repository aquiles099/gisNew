import { Component, OnInit } from '@angular/core';
import { GisLayerService } from '../../../../../../services/gis/gis-layer.service'
import { GisLayer } from '../../../../../../models/gis-layer'
import { MapLayerService } from '../../../../../../services/gis/map/map-layer.service'
import { BaseToolComponent } from '../base-tool/base-tool.component';
import { ToolService } from '../../../../../../services/gis/map/tool.service';
import { MapService } from '../../../../../../services/gis/map/map.service';

@Component({
  templateUrl: './feature-labeling.component.html',
  styleUrls: ['./feature-labeling.component.scss']
})
export class FeatureLabelingComponent extends BaseToolComponent 
{
  public attributes: any = [];
  public search: string = null;
  public layer: GisLayer;
  public selected_value: any = [];
  public selected_attribute_value: string;
  public showSpinner: boolean;

  constructor
    (
      protected toolService: ToolService,
      protected mapService: MapService,
      private _gisLayerService: GisLayerService,
      private _mapLayerService: MapLayerService

    ) {

    super(
      toolService,
      mapService
    );

    this.key = "feature-info";
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

    this.selected_value = event.target.value;

    this.layer.addLabel(this.selected_value);

  }

  remove() {
    this.layer.removeLabel();


  }

  removeAll() {
    for (let layer of this._mapLayerService.projectedLayers) {
      layer.removeLabel();
    }

  }

}
