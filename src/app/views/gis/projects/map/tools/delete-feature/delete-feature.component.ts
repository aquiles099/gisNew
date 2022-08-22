import { Component, OnInit } from '@angular/core';
import { ToolService } from '../../../../../../services/gis/map/tool.service';
import { MapService } from '../../../../../../services/gis/map/map.service';
import { BaseToolComponent } from '../base-tool/base-tool.component';

@Component({
  templateUrl: './delete-feature.component.html',
  styleUrls: ['./delete-feature.component.scss']
})
export class DeleteFeatureComponent extends BaseToolComponent 
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

    this.key = "copy-feature";
  }

}
