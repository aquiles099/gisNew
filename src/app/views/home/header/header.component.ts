import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from '../../../services/auth.service';
import { HomeService } from '../../../services/home.service';
import { getRandomColor } from '../../../shared/helpers';

@Component({
  selector: 'home-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations:[
    fadeInOnEnterAnimation({duration: 250}),
    fadeOutOnLeaveAnimation({duration: 250})
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {

  public userProfileImgSrc:string = 'assets/icons/svg/perfil.svg';

  public logoutWindowIsVisible: boolean = false;

  public itsOnTheLogoutWindow: boolean = false;

  public sidebarIsCollapsed:boolean;

  private homeServiceSubscription:Subscription;
  
  constructor(
    private _authService:AuthService,
    private _homeService:HomeService
  ) { }

  get user():User
  {
    return this._authService.authUserService.user;
  }

  public ngOnInit(): void
  {
    if( this.user.profile_photo_path )
      this.userProfileImgSrc = this.user.profile_photo_src;

    this.homeServiceSubscription = this._homeService.sidebarIsCollapsedObservable.subscribe(state => this.sidebarIsCollapsed = state);
  }

  public ngOnDestroy():void
  {
    this.homeServiceSubscription.unsubscribe();
  }

  public logout():void
  {
    this._authService.logout();
  }

  public toggleSidebarCollapsedState(): void
  {
    this._homeService.toggleSidebarCollapsedState( ! this.sidebarIsCollapsed );
  }

  public toggleLogoutWindowVisibility():void 
  {
    this.logoutWindowIsVisible = ! this.logoutWindowIsVisible;
  }
  
  public showLogoutWindow():void 
  {
    this.logoutWindowIsVisible = true;
  }

  public hideLogoutWindowAutomatically():void 
  {
    setTimeout(() => {

      if( ! this.itsOnTheLogoutWindow )
        this.hideLogoutWindow();

    }, 3000);
  }

  public overTheLogoutWindow():void 
  {
    this.itsOnTheLogoutWindow = true;
  }

  public hideLogoutWindow():void 
  {
    this.logoutWindowIsVisible = false;
    this.itsOnTheLogoutWindow = false;
  }
}
