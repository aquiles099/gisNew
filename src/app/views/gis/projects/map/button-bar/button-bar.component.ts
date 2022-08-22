import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestedProjectService } from '../../../../../services/requested-project.service';
import { Project } from '../../../../../interfaces/project';
import { GisToolGroup } from '../../../../../interfaces/gis-tool-group';
import { GisTool } from '../../../../../interfaces/gis-tool';
import { Subscription } from 'rxjs';
import { ToolService } from '../../../../../services/gis/map/tool.service';

@Component({
  selector: 'map-button-bar',
  templateUrl: './button-bar.component.html',
  styleUrls: ['./button-bar.component.scss']
})
export class ButtonBarComponent
{
  public toolGroups:GisToolGroup[] = [];

  @ViewChild('buttonBar')
  public buttonBar:ElementRef<HTMLElement>;

  @Output()
  public whenTogglingActivatedStateInTool:EventEmitter<GisTool|null> = new EventEmitter;

  constructor(
    private _toolService:ToolService,
    private route:ActivatedRoute,
    private _requestedProjectService:RequestedProjectService
  ) { }

  get project():Project
  {
    return this._requestedProjectService.project;
  }

  get thereIsAnEnabledTool():boolean
  {
    return this._toolService.thereIsAnEnabledTool;
  }

  @Input()
  set setToolGroups(groups:GisToolGroup[])
  {
    
    this.toolGroups = groups.map(group => {
      
      group['selected'] = false;
      
      group.gis_tools = group.gis_tools.map(tool => {

         tool['selected'] = false;

         return tool;
      });

      return group;
    });
  }

  public toogleSelectedStateOnToolGroup(group:GisToolGroup):void
  {
    if( group.selected )
    {
      group.selected = false;
    }
    else
    {
      group.selected = true;

      this.toolGroups.forEach(_group => {
        if( _group.name !== group.name )
          _group.selected = false;
      });
    }
  }

  public toogleSelectedStateInTool(tool:GisTool):void
  {
    tool.selected ?
    this._toolService.disableTool() :
    this._toolService.enableTool(tool);
  }
}
