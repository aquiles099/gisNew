import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CustomValidators } from '../../../../providers/CustomValidators';
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert2';
import { toggleFullscreen, checkIfTheFileExtensionIsCorrect, getFileExtension } from '../../../../shared/helpers';
import { getFileContent } from 'src/app/shared/helpers';

//services
import { UserService as CRUDService } from '../../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ObjectUtility } from '../../../../shared/object-utility';
import { ActivatedRoute,Router } from '@angular/router';


@Component({
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  public sendingForm: boolean;
  public form_model: any;
  public model_form_control: any;
  public invalid_password:any;

  public userLogoImgSrc:string = "assets/images/agregar-foto.png";
  public userLogoImgExtension :string = null;

  constructor(
    private _crudService: CRUDService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private _toastrService:ToastrService,
    private router:Router,


  ) {
    this.form_model =  new FormGroup({
      _method:new FormControl('POST'),
      first_name:new FormControl('',[
        Validators.required,
        Validators.maxLength(50)
 
      ]),
      last_name:new FormControl('',[
        Validators.required,
        Validators.maxLength(50)
      ]),
      email: new FormControl('',
      [Validators.required,
        Validators.maxLength(50)],
      ),
      user_name: new FormControl('',[
        Validators.required,
        Validators.maxLength(50)]),
      password: new FormControl('',[
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50)]),
      password_confirmation: new FormControl('',[
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50)
      ]),
      telephone: new FormControl('',[
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})')
      ]),
      identification_document: new FormControl('',Validators.required),
      user_id:new FormControl(''),
      image:new FormControl('',Validators.required)
 
    },
    [CustomValidators.MatchValidator('password', 'password_confirmation')]
 
    );
 
     this.model_form_control = this.form_model.controls;
 
     this.sendingForm = false;

   }

   public async sendForm(form:HTMLFormElement):Promise<void>
   {
     try
     {      
       this.spinner.show();
 
       const data = this.form_model.value;
       const formData = new FormData(form);
 
       this._crudService.store(formData).subscribe(
         response => this.handleResponse(response),
         err => {
           this.sendingForm = false
         
         },
         () => {
           this.sendingForm = false
   
         }
       );
 
    
     }
     finally
     {
     }
   }
 


   public onSubmit(): void {
    if (this.sendingForm) {
      return;

    }
    this.sendingForm = true;
    this.spinner.show();

        this._crudService.store(this.form_model.value).subscribe(
          response => this.handleResponse(response),
          err => {
            this.sendingForm = false

          },
          () => {
            this.sendingForm = false

          }
        );

       







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

  get passwordMatchError() {
    return (
      this.form_model.getError('mismatch') &&
      this.form_model.get('password_confirmation')?.touched
    );
  }

  public clearForm():void
  {
    this.form_model.reset();

    this.sendingForm = false;
   


  }

  private handleResponse(response:any):void
  {
    this.spinner.hide();

    this.userLogoImgSrc= "assets/images/agregar-foto.png";
    swal.fire('Usuario creado, pendiente por verificar',response.message,'success').then(()=>{
      this.clearForm();
    });
  }

  back()
  {
    this.router.navigateByUrl('/home/usuarios');

  }

  public togglePasswordVisibility(passwordField:HTMLInputElement):void
  {
    passwordField.type = passwordField.type === "password" ? "text" : "password";
  }

  ngOnInit(): void {
  }

}
