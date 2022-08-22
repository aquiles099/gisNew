import { Component, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { HomeService } from '../../services/home.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit
{   
  public sidebarIsCollapsed:boolean;

  private homeServiceSubscription:Subscription;

  constructor(
    private _homeService:HomeService
  ) { }

  public ngOnInit(): void
  {
    this.homeServiceSubscription = this._homeService.sidebarIsCollapsedObservable.subscribe(state => this.sidebarIsCollapsed = state);
  }

  public ngOnDestroy():void
  {
    this.homeServiceSubscription.unsubscribe();
  }
}
