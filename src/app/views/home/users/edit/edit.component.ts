import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CustomValidators } from '../../../../providers/CustomValidators';
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert2';
import { ActivatedRoute,Router } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { toggleFullscreen, checkIfTheFileExtensionIsCorrect, getFileExtension } from '../../../../shared/helpers';
import { getFileContent } from 'src/app/shared/helpers';

//services
import { UserService as CRUDService } from '../../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ObjectUtility } from '../../../../shared/object-utility';




@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  public sendingForm: boolean;
  public form_model: any;
  public model_form_control: any;
  public invalid_password: any;

  public model: any;

  public userLogoImgSrc:string = "assets/images/agregar-foto.png";
  public userLogoImgExtension :string = null;



  constructor(
    private _crudService: CRUDService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router:Router,
    private _toastrService: ToastrService,


  ) {
    this.form_model = new FormGroup({
      _method: new FormControl('PUT'),
      first_name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)

      ]),
      last_name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)
      ]),
      email: new FormControl('',
        [Validators.required,
        Validators.maxLength(50)],
      ),
      user_name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)]),
      password: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(50)]),
      password_confirmation: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(50)
      ]),
      telephone: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})')
      ]),
      identification_document: new FormControl('', Validators.required),
      user_id: new FormControl(''),
      //change_password:new FormControl(false,Validators.requiredTrue),
      image: new FormControl('', Validators.required)


    },
      [CustomValidators.MatchValidator('password', 'password_confirmation')]

    );

    this.model_form_control = this.form_model.controls;

    this.sendingForm = false;

  }


  public validateIfChecked(): ValidatorFn {
    let that = this;

    return (control: AbstractControl): ValidationErrors | null => {
      const checked = that.form_model.get('change_password');
      const password = that.form_model.get('password');
      const password_confirmation = that.form_model.get('password_confirmation');

      if (checked && !password && !password_confirmation) {
        return {
          'err': true
        };
      } else {
        return null;
      }


    };
  }


  get isRequiredError() {
    return (
      this.form_model.getError('err')
    );
  }


  public async sendForm(form: HTMLFormElement): Promise<void> {
    try {
      this.spinner.show();

      const data = this.form_model.value;
      const formData = new FormData(form);


      this._crudService.update(formData).subscribe(
        response => this.handleResponse(response),
        err => {
          this.sendingForm = false

        },
        () => {
          this.sendingForm = false

        }
      );


    }
    finally {
    }
  }

  public onSubmit(): void {
    if (this.sendingForm) {
      return;

    }
    this.sendingForm = true;
    this.spinner.show();

    this._crudService.update(this.form_model.value).subscribe(
      response => this.handleResponse(response),
      err => {
        this.sendingForm = false

      },
      () => {
        this.sendingForm = false

      }
    );



  }
  get passwordMatchError() {
    return (
      this.form_model.getError('mismatch') &&
      this.form_model.get('password_confirmation')?.touched
    );
  }

  public clearForm(): void {
    this.form_model.reset();

    this.sendingForm = false;



  }


  public async onSelectUserLogo(event:any):Promise<void>
  {
    try {
      
      const file = event.target.files[0];
  
      if(file)
      {
        if( ! checkIfTheFileExtensionIsCorrect([file], ["jpg","jpeg","png"]) )
          throw new Error("El archivo debe ser una imagen con extensión jpg, jpeg o png");

          this.userLogoImgSrc = await getFileContent(file, "dataURL");
          this.userLogoImgExtension = await getFileExtension(file);
      }

    }
    catch (error)
    {
      this._toastrService.error(error.message, "Error");
      event.target.value = null;
    }
  }

  private handleResponse(response: any): void {
    this.spinner.hide();

    swal.fire('Usuario modificado exitosamente', response.message, 'success').then(() => {
    });
  }


  public togglePasswordVisibility(passwordField: HTMLInputElement): void {
    passwordField.type = passwordField.type === "password" ? "text" : "password";
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      this.model = data.model.data;


      this.userLogoImgSrc= this.model.image_src;

      this.form_model.patchValue({
        _method: 'PUT',
        user_name: this.model.user_name,
        first_name: this.model.first_name,
        last_name: this.model.last_name,
        email: this.model.email,
        password: this.model.password,
        password_confirmation: this.model.password_confirmation,
        telephone: this.model.telephone,
        identification_document: this.model.identification_document,
        user_id: this.model.id,
        image:this.model.image_src

      });


    });
  }

  back()
  {
    this.router.navigateByUrl('/home/usuarios');

  }


}
