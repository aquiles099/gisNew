import { Component, Input, OnInit } from '@angular/core';
import { User } from '@models/user';
import { AuthService } from '../../../../../services/auth.service';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { RequestedProjectService } from '../../../../../services/requested-project.service';
import { Project } from '../../../../../interfaces/project';
import { Router, ActivatedRoute } from '@angular/router';
import { Module } from '../../../../../interfaces/module';

@Component({
  selector: 'map-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations:[
    fadeInOnEnterAnimation({duration: 250}),
    fadeOutOnLeaveAnimation({duration: 250})
  ]
})
export class HeaderComponent implements OnInit
{
  @Input()
  public projects:Partial<Project>[] = [];
  
  @Input()
  public modules:Module[] = [];

  public project:any;

  public userProfileImgSrc:string = 'assets/icons/svg/perfil.svg';

  public logoutWindowIsVisible: boolean = false;

  public itsOnTheLogoutWindow: boolean = false;

  public sidebarIsCollapsed:boolean;

  selected?: string;
  states: string[] = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Dakota',
    'North Carolina',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming'
  ];
  
  constructor(
    private _authService:AuthService,
    private _requestedProjectService:RequestedProjectService,
    private route:ActivatedRoute,
    private _router:Router,
  ) { }

  get user():User
  {
    return this._authService.authUserService.user;
  }

  public ngOnInit(): void
  {
    if( this.user.profile_photo_path )
      this.userProfileImgSrc = this.user.profile_photo_src;

    this.project = this._requestedProjectService.project;
  }

  public async onChangeProject(project:Partial<Project>):Promise<void>
  {    
    try
    {  
      const routeReuseStrategy = this._router.routeReuseStrategy.shouldReuseRoute;
      this._router.routeReuseStrategy.shouldReuseRoute = () => false;
  
      await this._router.navigateByUrl(`/gis/proyectos/${project.id}/mapa`);

      this._router.routeReuseStrategy.shouldReuseRoute = routeReuseStrategy;
    }
    finally
    {

    }
  }

  public logout():void
  {
    this._authService.logout();
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
