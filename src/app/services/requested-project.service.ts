import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project } from '../interfaces/project';
import { Province } from '../interfaces/province';

@Injectable({
  providedIn: 'root'
})
export class RequestedProjectService
{

  private projectSubject:BehaviorSubject<Project>;
  public projectObservable:Observable<Project>;

  constructor()
  {
    this.projectSubject = new BehaviorSubject(null);
    this.projectObservable = this.projectSubject.asObservable();
  }

  public next(project:Project):void
  {
    this.projectSubject.next(Object.assign({},project));
  }

  get project():Project
  {
    return this.projectSubject.getValue();
  }
 
  get id():number
  {
    return this.project.id;
  }
  
  get bbox():number[][]
  {
    return this.project.municipality.box2D.map(point => point.reverse()); 
  }

  get geoserverUrl():string
  {
    return environment.GEOSERVER_URL + `/project_${this.id}/wms?`;
  }

  get province():Province
  {
    return this.project.municipality.province;
  }

  public clear():void
  {
    this.next(null);
  }}
