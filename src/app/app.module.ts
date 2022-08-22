import { APP_INITIALIZER, LOCALE_ID, NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { RegistrationComponent } from './views/registration/registration.component';
import { PasswordRecoveryComponent } from './views/password-recovery/password-recovery.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';

import { SharedModule } from './shared/shared.module';

// services
import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';
import { RegisterService } from './services/register.service';
import { ProvinceService } from './services/locations/province.service';

import { NgxSpinnerModule } from "ngx-spinner";
import { NgSelectModule } from '@ng-select/ng-select';

function checkIfASessionExists(
  tokenService:TokenService,
  authenticationService:AuthService
): () => Promise<void> {
  return () =>  new Promise<void>(async resolve => {

    try
    {
      const token = localStorage.getItem('auth_token');

      if( token )
      {
        tokenService.setToken(token);
        await authenticationService.getAuthUser();
      }
    }
    finally
    {
      resolve();
    }
  }) 
}

// interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HomeService } from './services/home.service';
import { DragToScrollDirective } from './directives/drag-to-scroll.directive';
import { LoginProfileComponent } from './views/login-profile/login-profile.component';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PasswordRecoveryComponent,
    RegistrationComponent,
    ChangePasswordComponent,
    DragToScrollDirective,
    LoginProfileComponent,
  ],
  imports: [
    NgxSpinnerModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgSelectModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: checkIfASessionExists,
      deps: [TokenService, AuthService],
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'es-ES' },
    httpInterceptorProviders,
    RegisterService,
    ProvinceService,
    HomeService
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
