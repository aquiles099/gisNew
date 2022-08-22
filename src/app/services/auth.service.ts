import { Injectable } from '@angular/core';
import { AuthUserService } from './auth-user.service';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { delayExecution } from '@shared/helpers';

interface LoginResponse
{
  user: User;
  authorization: {
    "token": string;
    "type": string
  }
}

@Injectable({
  providedIn: "root"
})
export class AuthService 
{
	public redirect:string;
  
  constructor(
    public authUserService: AuthUserService,
    private _tokenService:TokenService,
    private router:Router,
    private http:HttpClient,

  ) { }

  public async login(credentials:{user_name:string, password:string}):Promise<void>
  {    
    try
    {
      const response = await this.http.post<LoginResponse>(`${environment.administrationPublicUrl}/autenticacion/login`, credentials).toPromise(); 

      this.authUserService.next(response?.user);

      this._tokenService.setToken(response.authorization.token);

      if( ! this.redirect )
        this.redirect = '/home';

      await delayExecution(3000);
      
      await this.router.navigateByUrl(this.redirect);
   
    }
    catch(error)
    {
      throw error;
    }
  }

  public async change_password(credentials:{password:any,password_confirmation:any,email:any,token:any}):Promise<void>
  {    
    try
    {
      const response = await this.http.post<any>(`${environment.administrationApiUrl}/reset-password`, credentials).toPromise(); 

      await Swal.fire({
        icon: 'success',
        title: `Su contraseña ha sido actualizada exitosamente`,
        showConfirmButton: true,
        heightAuto: false
      });

      this.router.navigateByUrl('/login')
    }
    catch(error)
    {
      throw error;
    }
  }
 

  public async password_recovery(credentials:{email:any}):Promise<void>
  {    
    try
    {
      const response = await this.http.post<any>(`${environment.administrationApiUrl}/forgot-password`, credentials).toPromise(); 

      await Swal.fire({
        icon: 'success',
        title: `Por favor verifique su correo electronico`,
        showConfirmButton: true,
        heightAuto: false
      });

      this.router.navigateByUrl('/login')
    }
    catch(error)
    {
      throw error;
    }
  }
 
  public async logout():Promise<boolean>
  {    
    try{

      await this.http.get(`${environment.administrationPublicUrl}/autenticacion/logout`).toPromise(); 

      this.flushAuthUserDataOnTheBrowser();

      Swal.fire({
        icon: 'success',
        title: `Sesion cerrada.`,
        showConfirmButton: false,
        timer: 1500,
        heightAuto: false
      });

      this.authUserService.clear();


      return this.router.navigateByUrl("/login");
    }
    catch(error)
    {
      throw error;
    }
  }

  public async logoutByTokenExpiration(showMessage:boolean = true):Promise<void>
  {
    try
    {
      if( this._tokenService.getToken() )
      {
        Swal.fire({
          title: 'Sesión expirada.',
          text: 'Por favor, inicie sesión nuevamente.',
          icon: 'success',
          confirmButtonText: "OK",
          heightAuto: false
        });
      }
      this.authUserService.clear();

      this.flushAuthUserDataOnTheBrowser();
      
      await this.router.navigateByUrl("/login");

    }
    catch(error)
    {
      throw error;
    }
  }

  public async getAuthUser():Promise<void>
  {    
    try
    {
      const response = await this.http.get<User>(`${environment.administrationPublicUrl}/autenticacion/usuario`).toPromise(); 

      this.authUserService.next(response);
    }
    catch(error)
    {
      throw error;
    }
  }

  private flushAuthUserDataOnTheBrowser():void
  {
    this._tokenService.clear();
  }
}
