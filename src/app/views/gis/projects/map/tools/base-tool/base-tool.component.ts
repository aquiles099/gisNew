import { Component, OnInit } from '@angular/core';
import { ToolService } from '../../../../../../services/gis/map/tool.service';
import { MapService } from '../../../../../../services/gis/map/map.service';
import { Map } from 'leaflet';

@Component({
  templateUrl: './base-tool.component.html',
  styleUrls: ['./base-tool.component.scss']
})
export class BaseToolComponent
{
  public showSpinner:boolean;

  protected key:string; 

  constructor(
    protected toolService:ToolService,
    protected mapService:MapService
  ) { }

  get map():Map
  {
    return this.mapService.map;
  }

  get isCollapsed():boolean
  {
    return this.toolService.isCollapsed;
  }

  public getKey():string
  {
    return this.key;
  }

  public close():void
  {
    this.toolService.disableTool();
  }
}
