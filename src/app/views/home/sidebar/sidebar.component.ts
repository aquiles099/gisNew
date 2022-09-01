import { Component, OnInit } from '@angular/core';
import { fadeInRightOnEnterAnimation, fadeOutRightOnLeaveAnimation } from 'angular-animations';
import { Subscription } from 'rxjs';
import { HomeService } from '../../../services/home.service';
import { AuthUserService } from '../../../services/auth-user.service';
import { User } from '../../../models/user';

const ANIMATION_DURATION = 250;

@Component({
  selector: 'home-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    fadeInRightOnEnterAnimation({duration: ANIMATION_DURATION}),
    fadeOutRightOnLeaveAnimation({duration: ANIMATION_DURATION})
  ]
})
export class SidebarComponent implements OnInit {

  public mainRoutes:any[] = [
    {
      'id': 'dashboard',
      'path': ['/home','tablero','gmao'],
      'iconPath': 'assets/icons/svg/dashboard.svg',
      'label': 'Dashboard'
    },
    {
      'id': 'projects',
      'path': ['/home','proyectos'],
      'iconPath': 'assets/icons/svg/proyecto.svg',
      'label': 'Proyectos'
    }
  ];
 
  public administrationRoutes:any[] = [
    {
      'id': 'users',
      'path': ['/home','usuarios'],
      'iconPath': 'assets/icons/svg/usuarios.svg',
      'label': 'Usuarios'
    }
  ];

  public isCollapsed:boolean;

  private homeServiceSubscription:Subscription;

  constructor(
    private _homeService:HomeService,
    private _authUserService:AuthUserService
  ) { }

  get user():User
  {
    return this._authUserService.user;
  }

  public ngOnInit(): void
  {
    this.homeServiceSubscription = this._homeService.sidebarIsCollapsedObservable.subscribe(state => this.isCollapsed = state);

    if( this.user.isAdmin )
    {
      this.administrationRoutes.push({
        'id': 'companies',
        'path': ['/home','empresas'],
        'iconPath': 'assets/icons/svg/empresa.svg',
        'label': 'Empresas'
      });
    }
  }

  public ngOnDestroy():void
  {
    this.homeServiceSubscription.unsubscribe();
  }

  public toggleCollapsedState(): void
  {
    this._homeService.toggleSidebarCollapsedState( ! this.isCollapsed );
  }
}
