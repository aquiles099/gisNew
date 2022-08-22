import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { AuthUserService } from '../../services/auth-user.service';

import { Router } from '@angular/router';
import { LoginProfileComponent } from '../login-profile/login-profile.component';
import { User } from '../../models/user';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit
{
  public form: FormGroup;

  public sendingForm:boolean = false;
  public passwordHasUppercase:boolean = false;
  public error:boolean = false;
  public errorMessage:string = '';
  
  constructor(
    private _authService: AuthService,
    private router: Router

  )
  {
    this.form = new FormGroup({
      user_name: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  } 
  
  get userField():AbstractControl|null
  {
    return this.form.get("user_name");
  }

  get passwordField():AbstractControl|null
  {
    return this.form.get("password");
  }
  
  get authUser():User
  {
    return this._authService.authUserService.user;
  }

  public ngOnInit(): void
  {
    sessionStorage.clear();
    localStorage.clear();

    this.form.get('password')?.valueChanges.subscribe((value:string) => {

      this.passwordHasUppercase = Array.from(value).some(char => char === char.toUpperCase());

    });
  }

  public back()
  {
    this.error = false;
    this.errorMessage = '';
    this.router.navigate([`/login`]);
  }

  public async onSubmit():Promise<void>
  {
    try
    {
      if (this.form.valid)
      {
        this.sendingForm = true;

        await this._authService.login({
          user_name: this.form.get('user_name').value,
          password: this.form.get('password').value,
        });
      
      }
    }
    catch(error)
    {
      this.error = true;
      this.errorMessage = error.error.error;
    }
    finally
    {
      this.sendingForm = false;
    }
  }

  public togglePasswordVisibility(passwordField:HTMLInputElement):void
  {
    passwordField.type = passwordField.type === "password" ? "text" : "password";
  }
}
