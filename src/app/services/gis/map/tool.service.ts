import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { GisTool } from '../../../interfaces/gis-tool';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ToolService {

  private enabledToolSubject:BehaviorSubject<GisTool>;
  public enabledToolObservable:Observable<GisTool>;

  private collapsed:boolean = true;

  public clearSelectLayer: EventEmitter<any> = new EventEmitter();

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
 
  get isCollapsed():boolean
  {
    return this.collapsed;
  }

  public enableTool(tool:GisTool):void
  {
    tool.selected = true;
    this.enabledToolSubject.next(tool);

    let url = this._router.url.substring(0, this._router.url.indexOf('/mapa') + '/mapa'.length);
    this._router.navigateByUrl(`${url}/${tool.path}`);
  }
  
  public disableTool():void
  {
    this.enabledTool.selected = false;
    this.enabledToolSubject.next(null);
    this.collapsed = true;
    this.goToBaseUrl();
  }

  public goToBaseUrl():void
  {
    let url = this._router.url.substring(0, this._router.url.indexOf('/mapa') + '/mapa'.length);
    this._router.navigateByUrl(url);
  }

  public toggleCollapsedState():void
  {
    this.collapsed = ! this.collapsed;
  }

  public clear():void
  {
    this.enabledToolSubject.next(null);
  }
}
