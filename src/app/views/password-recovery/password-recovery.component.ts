import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent implements OnInit {
  public form: FormGroup;

  public sendingForm:boolean = false;
  
  constructor(
    private _authService: AuthService,
    private spinner: SpinnerService
  )
  {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required,
        Validators.maxLength(50)
  
      ]),
    });
  } 

  get emailField():AbstractControl|null
  {
    return this.form.get("email");
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
        this.sendingForm = true;
        this.spinner.show();

       await this._authService.password_recovery({
        email: this.form.get('email').value,
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
