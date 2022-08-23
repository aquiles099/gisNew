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

  get enabledTool():Partial<GisTool>
  {
    return this._toolService.enabledTool;
  }
 
  get isVisible():boolean
  {
    return this._toolService.thereIsAnEnabledTool;
  }
  
  get isCollapsed():boolean
  {
    return this._toolService.toolBarIsCollapsed;
  }
 
  get buttonBarIsCollapsed():boolean
  {
    return this._toolService.buttonBarIsCollapsed;
  }

  public toggleCollapsedState():void
  {
    this._toolService.toggleToolBarCollapsedState();
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
