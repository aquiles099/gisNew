import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { ErrorHandlingService } from '../services/error-handling.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private exclude:string[] = [
    '/login',
  ];

  constructor(
    protected _tokenService: TokenService,
    private _errorHandlingService:ErrorHandlingService
  )
  {}

  public intercept(req: HttpRequest<any>, next: HttpHandler)
  {
    let requireAuth = this.exclude.every(path => ! req.url.includes(path));

    if( this._tokenService.isLoggedIn && requireAuth)
    {
      req = req.clone({
        headers: req.headers.set('Authorization',`Bearer ${this._tokenService.getToken()}`)
      });
    } 

    return next.handle(req)
                .pipe(
                  catchError((error:HttpErrorResponse) => {

                    this._errorHandlingService.handle(error);

                    return throwError(error);
                  })
                );
  }

}