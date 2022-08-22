import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CustomValidators } from '../../../../providers/CustomValidators';
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert2';
import { toggleFullscreen, checkIfTheFileExtensionIsCorrect, getFileExtension } from '../../../../shared/helpers';
import { getFileContent } from 'src/app/shared/helpers';

//services
import { CompanyService as CRUDService } from '../../../../services/administration/company.service';
import { ResourceService } from '../../../../shared/services/resource.service';
import { ProvinceService } from '../../../../services/locations/province.service';
import { ObjectUtility } from '../../../../shared/object-utility';

import { ToastrService } from 'ngx-toastr';


@Component({
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  public sendingForm: boolean;
  public form_model: any;
  public model_form_control: any;
  public invalid_password: any;

  public municipalities:Array<any>=[];

  public types:Array<any>=['legal','personal'];

  public sectors:Array<any>=['maintenance', 'consultancy','others','administration'];



  public companyLogoImgSrc:string = "assets/images/logo-empresa.png";
  public companyLogoImgExtension :string = null;
  public provinces:any[] = [];
  public loadingProvinces:boolean = false;
  public loadingMunicipalities:boolean = false;

  @ViewChild("imageInput")
  public imageInput:ElementRef<HTMLInputElement>;

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private _crudService: CRUDService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private __resourceService: ResourceService,
    private _provinceService:ProvinceService,
    private _toastrService:ToastrService,

  ) {

    this.form_model =  new FormGroup({
      name: new FormControl(null, Validators.required),
      cif: new FormControl(null, [Validators.required, Validators.min(10), Validators.max(10)]),
      image: new FormControl(null, Validators.required),
      telephone: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})')
      ]),
      province_id: new FormControl(null, Validators.required),
      municipality_id: new FormControl(null, Validators.required),
      admin_1: new FormGroup({
        first_name: new FormControl(null, Validators.required),
        last_name: new FormControl(null, Validators.required),
        identification_document: new FormControl(null, [Validators.required, Validators.min(10), Validators.max(10)]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        user_name: new FormControl(null, Validators.required),
        password: new FormControl(null, Validators.required),
      }),
      admin_2: new FormGroup({
        first_name: new FormControl(null),
        last_name: new FormControl(null),
        identification_document: new FormControl(null, [Validators.min(10), Validators.max(10)]),
        email: new FormControl(null, Validators.email),
        user_name: new FormControl(null),
        password: new FormControl(null),
      })
    });


  

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

      
      formData.append("municipality_id", this.form_model.get("municipality_id").value);

      for(let [key, value] of Object.entries( data.admin_1 )  )
        formData.append(`administrators[0][${key}]`, (value as string|Blob) );
            
      if( ObjectUtility.hasNoNullValues(data.admin_2) )
      {
        for(let [key, value] of Object.entries( data.admin_2 )  )
          formData.append(`administrators[1][${key}]`, (value as string|Blob) );
      } 

      //wait this._crudService.store(formData);

      const response = await this._crudService.store(formData)

      this.handleResponse(response);        
        
    }
    finally
    {
      this.sendingForm = false
    }
  }

  
  public async onSubmit():Promise<void>
  {
    try
    {
      if (this.sendingForm)
      return;

      this.sendingForm = true;

      this.spinner.show();

      await this._crudService.store(this.form_model.value);
    }
    finally
    {
      this.sendingForm = false

    }
  }


  public clearForm(): void {
    this.form_model.reset();

    this.sendingForm = false;



  }

  private handleResponse(response: any): void {
    this.spinner.hide();
    this._toastrService.success("Empresa registrada.","Success");

    this.form_model.reset();

    this.imageInput.nativeElement.value = null;

    this.companyLogoImgSrc = 'assets/images/logo-empresa.png';
    this.companyLogoImgExtension = null;

    
  }



  public async onSelectCompanyLogo(event:any):Promise<void>
  {
    try {
      
      const file = event.target.files[0];
  
      if(file)
      {
        if( ! checkIfTheFileExtensionIsCorrect([file], ["jpg","jpeg","png"]) )
          throw new Error("El archivo debe ser una imagen con extensión jpg, jpeg o png");

          this.companyLogoImgSrc = await getFileContent(file, "dataURL");
          this.companyLogoImgExtension = await getFileExtension(file);
      }

    }
    catch (error)
    {
      this._toastrService.error(error.message, "Error");
      event.target.value = null;
    }
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

  public toggleFullscreen(event:any):void
  {
      toggleFullscreen(event);
  }

  public togglePasswordVisibility(passwordField:HTMLInputElement):void
  {
    passwordField.type = passwordField.type === "password" ? "text" : "password";
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

  back()
  {
    this.router.navigateByUrl('/home/empresas');

  }


  ngOnInit(): void {

    this.loadProvinces();

  }

}
