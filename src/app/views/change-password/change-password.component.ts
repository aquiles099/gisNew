import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import {ActivatedRoute} from '@angular/router';
import { CustomValidators } from '../../providers/CustomValidators';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public form: FormGroup;
  private route:any;
  public sendingForm:boolean = false;
  public token:any;
  public email:any;
  
  constructor(
    private _authService: AuthService,
    route: ActivatedRoute, 
    private spinner: SpinnerService

  )
  {
    this.route=route;
    this.form = new FormGroup({
      password: new FormControl(null, [Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50)

      ]),
      password_confirmation: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50)

      ]),
        

    },
    [CustomValidators.MatchValidator('password', 'password_confirmation')]

    );
  } 

  get passwordMatchError() {
    return (
      this.form.getError('mismatch') &&
      this.form.get('password_confirmation')?.touched
    );
  }
  get passwordField():AbstractControl|null
  {
    return this.form.get("password");
  }

  
  get passwordConfirmationField():AbstractControl|null
  {
    return this.form.get("password_confirmation");
  }




  public ngOnInit(): void
  {
    sessionStorage.clear();
    localStorage.clear();
  }

  public async onSubmit():Promise<void>
  {

    try
    {
      if (this.form.valid)
      {

        this.route.queryParams.subscribe((params:any) => {
          this.token=params['token'];
          this.email=params['user'];

      });
        


        this.sendingForm = true;
        this.spinner.show();

      await this._authService.change_password({
        password: this.form.get('password').value,
        password_confirmation:this.form.get('password_confirmation').value,
        email:this.email,
        token:this.token
       });


       this.spinner.hide();

      }
    }
    finally
    {
      this.sendingForm = false;
    }
  }

  public sendForm(): void {
    if (this.sendingForm) {
      return;

    }
  }

  public togglePasswordVisibility(passwordField:HTMLInputElement):void
  {
    passwordField.type = passwordField.type === "password" ? "text" : "password";

  }
}
