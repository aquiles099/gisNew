import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class HomeService
{
  public sidebarIsCollapsedSubject:BehaviorSubject<boolean>;
  public sidebarIsCollapsedObservable:Observable<boolean>;
  
  constructor()
  {
    this.sidebarIsCollapsedSubject = new BehaviorSubject<boolean>(true);
    this.sidebarIsCollapsedObservable = this.sidebarIsCollapsedSubject.asObservable();
  }

  public toggleSidebarCollapsedState(state:boolean):void
  {
    this.sidebarIsCollapsedSubject.next(state);
  }
}
