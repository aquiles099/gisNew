import { Component, Input, Output, ViewChild, EventEmitter, OnInit, ElementRef } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { RegisterService as CRUDService } from '../../services/register.service';
import { showPreconfirmMessage } from '../../shared/helpers';
import swal from 'sweetalert2';
import { SpinnerService } from '../../services/spinner.service';
import { CustomValidators } from '../../providers/CustomValidators';
import { truncate } from 'fs';
import { ProvinceService } from '../../services/locations/province.service';
import {environment} from '../../../environments/environment';
import { Company } from '../../interfaces/company';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  @ViewChild('registerForm', { static: true }) registerForm: ElementRef;

  public sendingForm: boolean;
  public form_model: FormGroup;
  public model_form_control: any;
  public invalid_password:any;
  public municipalities:Array<any>=[];
  public provinces:any[] = [];
  public loadingProvinces:boolean = false;
  public loadingMunicipalities:boolean = false;

  public clicked_tabs:number=1;

  public tab1:any={
    is_active:true
  };

  public tab2:any={
    is_active:false
  };

  public tab3:any={
    is_active:false
  };


  constructor(
    private _crudService: CRUDService,
    private fb: FormBuilder,
    private spinner: SpinnerService,
    private _provinceService:ProvinceService,
    private router: Router


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
     company_name: new FormControl('',[
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
     ]),
     sector: new FormControl('',Validators.required),
     type: new FormControl('',Validators.required),
     user_id:new FormControl(''),
   //  accept_term:new FormControl(false,Validators.requiredTrue),
     province_id:new FormControl(null,Validators.required),
     municipality_id:new FormControl(null,Validators.required),
     module_name:new FormControl('',Validators.required)

   },
   [CustomValidators.MatchValidator('password', 'password_confirmation')]

   );

    this.model_form_control = this.form_model.controls;

    this.sendingForm = false;


  }

  public getControl(name:string):AbstractControl
  {
    return this.form_model.get(name);
  }

  public validTab1()
  {
    let first_name=this.model_form_control.first_name.valid;
    let last_name=this.model_form_control.last_name.valid;
    let email=this.model_form_control.email.valid;
    let telephone=this.model_form_control.telephone.valid;
    let password=this.model_form_control.password.valid;
    let password_confirmation=this.model_form_control.password_confirmation.valid;

    let company_name=this.model_form_control.company_name.valid;
    let type=this.model_form_control.type.valid;
    let sector=this.model_form_control.sector.valid;


    switch (this.clicked_tabs) {
        case 1:
          if((first_name && last_name && email && telephone && password && password_confirmation))
          {
            return false;
          }
        break;

        case 2:
          if((company_name && type && sector))
          {
            return false;
          }
        break;
    
     
    }

     return true;
   

  }

  private async loadProvinces(): Promise<void> {
    try {
      this.loadingProvinces = true;

      this.provinces = (await this._provinceService.all() as any[]);

   

      this.loadingProvinces = false;
    }
    catch (error) {
    }
  }

  public async onChangeProvinceSelector(province:{id:number, name:string}):Promise<void>
  {
    try {
      
      this.municipalities = [];

      this.loadingMunicipalities = true;

      this.form_model.patchValue({'municipality_id': null});
            
      this.municipalities = (await this._provinceService.getMunicipalities(province.id) as any);

    }
    finally
    {
      this.loadingMunicipalities = false;
    }
  }

  public addTab()
  {
    this.clicked_tabs++;
    let tab=`tab${this.clicked_tabs}`;

    this.changeTab(tab);
  }

  public subTab()
  {
    this.clicked_tabs--;
    let tab=`tab${this.clicked_tabs}`;

    this.changeTab(tab);
  }

  public changeTab(tab:any)
  {

    switch (tab) 
    {
      case 'tab1':

        this.tab1.is_active=true;
        this.tab2.is_active=false;
        this.tab3.is_active=false;

      break;

      case 'tab2':

        this.tab2.is_active=true;
        this.tab1.is_active=false;
        this.tab3.is_active=false;

      break;

      case 'tab3':

        this.tab1.is_active=false;
        this.tab2.is_active=false;
        this.tab3.is_active=true;

      break;
    
     
    }

  }
  
  public sendForm(): void {
    if (this.sendingForm) {
      return;

    }


    this.sendingForm = true;
    this.spinner.show(
      [
        'Creando proyecto de prueba...',
        'Esto puede demorarse un poco...',
        'Por favor espere...',
        'Generando estructura de capas...'
      ]
    );

        this._crudService.store(this.form_model.value).subscribe(
          response => this.handleResponse(response),
          err => {

            this.checkErrors(err.error.errors)
            this.sendingForm = false
            this.spinner.hide();
          },
          () => {
            this.sendingForm = false
            this.spinner.hide();

          }
        );

       







  }

  private checkErrors(err)
  {


    if(err.hasOwnProperty('email') || err.hasOwnProperty('telephone') || err.hasOwnProperty('password') || err.hasOwnProperty('password_confirmation')    )
    {
      this.clicked_tabs=1;
 
    }
    let tab=`tab${this.clicked_tabs}`;
  
    this.changeTab(tab);

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

    swal.fire('exito',response.message[0],'success').then(()=>{
      this.router.navigate([`/login`]);

      this.clearForm();
    });
  }


  public togglePasswordVisibility(passwordField:HTMLInputElement):void
  {

    passwordField.type = passwordField.type === "password" ? "text" : "password";
  }

  ngOnInit(): void {
    this.loadProvinces();

  }

}
