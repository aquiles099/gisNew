import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService
{
  private exclude:string[] = [
    '/login'
  ];

  constructor(
  	private _toastrService: ToastrService,    
  	private _authService: AuthService,
    private _router:Router,
    private spinner: NgxSpinnerService

  ) { }

  public async handle(error:HttpErrorResponse, closure?:() => any):Promise<void>
  {
    console.error(error);
    this.spinner.hide();

    if (closure)
    	closure();

    const handleError = this.exclude.every(path => ! this._router.url.includes(path));

    if (  handleError )
    {
        switch(true)
        {
          case (error.status === 500 || error.status === 0):


              if (! this._toastrService.currentlyActive)
                this._toastrService.error("Error interno de servidor.","Error");
                this._router.navigateByUrl('/home/error-interno');
              break;
          
          case error.status === 403:
              
              this._toastrService.error("Este usuario no tiene los permisos requeridos para realizar esta accion","No autorizado");   
              this._router.navigateByUrl('/home/no-autorizado');   
              break;

          case error.status === 401:

            	await this._authService.logoutByTokenExpiration();
              break;
      
          default: //422,... 

             const errors = error.error.errors;

             let html = "<ul style='list-style:none;' class='m-0 p-0'>";

             (Object.values(errors)[0] as string[]).forEach(_error => html += "<li>"+ _error +"</li>");
             
             this._toastrService.error(html,"Error");

             break;
        }
    }

  }


}