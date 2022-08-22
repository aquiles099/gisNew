import { Component, OnInit } from '@angular/core';
import { BaseToolComponent } from '../base-tool/base-tool.component';
import { ToolService } from '../../../../../../services/gis/map/tool.service';
import { MapService } from '../../../../../../services/gis/map/map.service';

@Component({
  templateUrl: './move-feature.component.html',
  styleUrls: ['./move-feature.component.scss']
})
export class MoveFeatureComponent extends BaseToolComponent 
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

    this.key = "move-feature";
  }
}
