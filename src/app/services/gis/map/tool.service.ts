import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GisTool } from '../../../interfaces/gis-tool';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ToolService {

  private enabledToolSubject:BehaviorSubject<GisTool>;
  public enabledToolObservable:Observable<GisTool>;

  private buttonBarCollapsed:boolean = false;
  private toolBarCollapsed:boolean = true;

  constructor(
    private _router:Router
  ) { 
    this.enabledToolSubject = new BehaviorSubject(null);
    this.enabledToolObservable = this.enabledToolSubject.asObservable();
  }

  get thereIsAnEnabledTool():boolean
  {
    return this.enabledTool !== null;
  }

  get enabledTool():GisTool
  {
    return this.enabledToolSubject.getValue();
  }
 
  get buttonBarIsCollapsed():boolean
  {
    return this.buttonBarCollapsed;
  }
 
  get toolBarIsCollapsed():boolean
  {
    return this.toolBarCollapsed;
  }

  public enableTool(tool:GisTool):void
  {
    if( ! this.thereIsAnEnabledTool )
      this.buttonBarCollapsed = true;

    tool.selected = true;
    
    this.enabledToolSubject.next(tool);

    let url = this._router.url.substring(0, this._router.url.indexOf('/mapa') + '/mapa'.length);
    this._router.navigateByUrl(`${url}/${tool.path}`);
  }
  
  public disableTool():void
  {
    this.enabledTool.selected = false;
    this.enabledToolSubject.next(null);
    this.buttonBarCollapsed = false;
    this.goToBaseUrl();
  }

  public goToBaseUrl():void
  {
    let url = this._router.url.substring(0, this._router.url.indexOf('/mapa') + '/mapa'.length);
    this._router.navigateByUrl(url);
  }

  public toggleButtonBarCollapsedState():void
  {
    this.buttonBarCollapsed = ! this.buttonBarCollapsed;
  }
 
  public toggleToolBarCollapsedState():void
  {
    this.toolBarCollapsed = ! this.toolBarCollapsed;
  }

  public clear():void
  {
    this.enabledToolSubject.next(null);
  }
}
