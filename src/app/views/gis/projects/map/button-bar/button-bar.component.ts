import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestedProjectService } from '../../../../../services/requested-project.service';
import { Project } from '../../../../../interfaces/project';
import { GisToolGroup } from '../../../../../interfaces/gis-tool-group';
import { GisTool } from '../../../../../interfaces/gis-tool';
import { ToolService } from '../../../../../services/gis/map/tool.service';

@Component({
  selector: 'map-button-bar',
  templateUrl: './button-bar.component.html',
  styleUrls: ['./button-bar.component.scss']
})
export class ButtonBarComponent implements OnInit
{
  public toolGroups:GisToolGroup[] = [];

  @ViewChild('buttonBar')
  public buttonBar:ElementRef<HTMLElement>;

  @Output()
  public whenTogglingActivatedStateInTool:EventEmitter<GisTool|null> = new EventEmitter;

  private onSmallScreen:boolean = false; 

  constructor(
    public toolService:ToolService,
    private route:ActivatedRoute,
    private _requestedProjectService:RequestedProjectService
  ) { }

  public ngOnInit(): void
  {
    this.onWindowResize();
  }

  @HostListener("window:resize")
  public onWindowResize(): void
  {
    const screenWidth = (window as any).visualViewport ? (window as any).visualViewport.width : window.screen.width;
    this.onSmallScreen = ! (screenWidth > 576);

    if( this.onSmallScreen && this.toolService.thereIsAnEnabledTool )
      this.toolService.toggleButtonBarCollapsedState();
  }

  get isOnSmallScreen():boolean
  {
    return this.onSmallScreen;
  }

  get isCollapsed():boolean
  {
    return this.toolService.buttonBarIsCollapsed;
  }

  get project():Project
  {
    return this._requestedProjectService.project;
  }

  get thereIsAnEnabledTool():boolean
  {
    return this.toolService.thereIsAnEnabledTool;
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

  public toogleSelectedStateInTool(tool:GisTool|GisToolGroup):void
  {
    if( this.toolService.enabledTool === tool )
    {
      this.toolService.disableTool();
    }
    else
    {
      if( this.thereIsAnEnabledTool )
        this.toolService.enabledTool.selected = false;
      
      this.toolService.enableTool(tool);
    }
  }
}
