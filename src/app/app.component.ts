import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';
import { SpinnerService } from './services/spinner.service';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { delayExecution } from '@shared/helpers';

const ANIMATION_DURATION = 500;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeInOnEnterAnimation({duration: ANIMATION_DURATION}),
    fadeOutOnLeaveAnimation({duration: ANIMATION_DURATION})
  ]
})
export class AppComponent
{
  public spinnerHtml:string = "";

  constructor(
    private _ngCongifService: NgSelectConfig,
    private _spinnerService: SpinnerService,
    private router: Router,
    // private _shepherdService:ShepherdService
  ) {
    this._ngCongifService.addTagText = 'Presione Enter o haga click aqui para agregar opción';
    this._ngCongifService.notFoundText = 'Sin opciones';
    this._ngCongifService.placeholder = 'Seleccione una opción';
    this._ngCongifService.loadingText = "Espere...";
    this._ngCongifService.clearAllText = "Limpiar";

    this.router.events.subscribe(event => {

      if( event instanceof NavigationStart )
        this._spinnerService.show();

      if( event instanceof NavigationEnd )
        this._spinnerService.hide();
    });
  }

  ngOnInit()
  {
    /* Configuracion por defecto Shepherd JS */

    // this._shepherdService.defaultStepOptions = {
    //   scrollTo: true,
    //   cancelIcon: {
    //     enabled: true
    //   },
    //   modalOverlayOpeningPadding: 10,
    //   popperOptions: {
    //     modifiers: [{ name: 'offset', options: { offset: [0, 12] } }]
    //   }
    // };

    // this._shepherdService.modal = true;
    
    // this._shepherdService.confirmCancel = false;
    
    /* ****** */

    this._spinnerService.contentObservable.subscribe(html => this.spinnerHtml = html);

    this.router.events.subscribe((evt) => {

      if (!(evt instanceof NavigationEnd))
        return;

      window.scrollTo(0, 0);
    });
  }
}