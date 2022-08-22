import { Component, OnInit } from '@angular/core';
import { BaseToolComponent } from '../base-tool/base-tool.component';
import { ToolService } from '../../../../../../services/gis/map/tool.service';
import { MapService } from '../../../../../../services/gis/map/map.service';

@Component({
  templateUrl: './layer-categorization.component.html',
  styleUrls: ['./layer-categorization.component.scss']
})
export class LayerCategorizationComponent extends BaseToolComponent 
{
  constructor(
    protected toolService:ToolService,
    protected mapService:MapService
  )
  {
    super(
      toolService,
      mapService
    );

    this.key = "layer-categorization";
  }
}
