import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToolService } from '../../../../../services/gis/map/tool.service';
import { GisTool } from '../../../../../interfaces/gis-tool';

@Component({
  selector: 'map-tool-sidebar',
  templateUrl: './tool-sidebar.component.html',
  styleUrls: [
    './tool-sidebar.component.scss'
  ]
})
export class ToolSidebarComponent implements OnInit, OnDestroy
{
  constructor(
    private _toolService:ToolService
  ) {  }

  get enabledTool():GisTool
  {
    return this._toolService.enabledTool;
  }
 
  get isVisible():boolean
  {
    return this._toolService.thereIsAnEnabledTool;
  }
  
  get isCollapsed():boolean
  {
    return this._toolService.isCollapsed;
  }

  public toggleCollapsedState():void
  {
    this._toolService.toggleCollapsedState();
  }
  
  public close():void
  {
    this._toolService.disableTool();
  }


  public ngOnInit(): void
  {
    
  }

  public ngOnDestroy(): void
  {
    
  }
}
