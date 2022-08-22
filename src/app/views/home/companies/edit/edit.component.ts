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

import { ToastrService } from 'ngx-toastr';
import { ObjectUtility } from '../../../../shared/object-utility';

import { Subscription } from 'rxjs';


@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  public routeDataSubscription: Subscription;

  public sendingForm: boolean;
  public form_model: any;
  public model_form_control: any;
  public invalid_password: any;

  public municipalities: Array<any> = [];

  public types: Array<any> = ['legal', 'personal'];

  public sectors: Array<any> = ['maintenance', 'consultancy', 'others', 'administration'];


  public users: any[] = [];
  public company: any;

  public companyLogoImgSrc:string = "assets/images/logo-empresa.png";
  public companyLogoImgExtension: string = null;
  public provinces: any[] = [];
  public loadingProvinces: boolean = false;
  public loadingMunicipalities: boolean = false;

  public model: any;
  public is_active:boolean;

  @ViewChild("imageInput")
  public imageInput: ElementRef<HTMLInputElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _crudService: CRUDService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private __resourceService: ResourceService,
    private _provinceService: ProvinceService,
    private _toastrService: ToastrService,

  ) {

    this.form_model = new FormGroup({
      name: new FormControl(null, Validators.required),
      cif: new FormControl(null, Validators.required),
      image: new FormControl(null),
      province_id: new FormControl(null),
      municipality_id: new FormControl(null, Validators.required),
      is_active: new FormControl(false,Validators.requiredTrue),
      user_ids: new FormControl(null, Validators.required),
      max_users_number: new FormControl(null),
      company_id: new FormControl(null)
    });

    this.model_form_control = this.form_model.controls;

    this.sendingForm = false;

  }

  ngOnInit(): void {

    this.route.data.subscribe((data: any) => {
      this.model = data.model.data;


       this.companyLogoImgSrc = this.model.image_src;
       this.company=this.model;
       
  
      this.form_model.patchValue({
        _method: 'PUT',
        name: this.model.name,
        cif: this.model.fiscal_id,
        municipality_id:this.model.municipality_id,
        company_id: this.model.id,
        image:this.model.image_src,
        province_id:this.model.municipality.province.id,
        user_ids:this.model.users.map(user => user.id),
        is_active:this.model.is_active

      });

      this.is_active=this.model.is_active;

      this.users=this.model.users;


    });
  }

  public async ngAfterContentInit(): Promise<void> {
    await this.loadProvinces();
    await this.onChangeProvinceSelector(this.company.municipality.province);
    this.form_model.patchValue({ "municipality_id": this.company.municipality_id });
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

  public async onSelectCompanyLogo(event: any): Promise<void> {
    try {

      const file = event.target.files[0];

      if (file) {
        if (!checkIfTheFileExtensionIsCorrect([file], ["jpg", "jpeg", "png"]))
          throw new Error("El archivo debe ser una imagen con extensión jpg, jpeg o png");

        this.companyLogoImgSrc = await getFileContent(file, "dataURL");
      }

    }
    catch (error) {
      this._toastrService.error(error.message, "Error");
      event.target.value = null;
    }
  }

  public toggleFullscreen(event: any): void {
    toggleFullscreen(event);
  }

  public async onChangeProvinceSelector(province:{id:number, name:string}):Promise<void>
  {
    try {
      
      this.municipalities = [];

      this.loadingMunicipalities = true;

      this.form_model.patchValue({'municipality_id': null});
            
      this.municipalities = (await this._provinceService.getMunicipalities(province.id) as any[]);

    }
    finally
    {
      this.loadingMunicipalities = false;
    }
  }

 

  public getFormValue(controlName: string): any {
    return this.form_model.get(controlName).value;
  }

  public async sendForm(form: HTMLFormElement): Promise<void> {
    try {
      this.spinner.show();

      const formData = new FormData(form);

      formData.append("is_active", this.getFormValue("is_active"));


      formData.append("municipality_id", this.getFormValue("municipality_id"));

      this.getFormValue("user_ids").forEach((id, i) => formData.append(`user_ids[${i}]`, id));

      await this._crudService.update(this.company.id, formData)

    }
      finally {
      this.sendingForm = false
      this.spinner.hide();
    }
  }

  private handleResponse(response: any): void {
    this.spinner.hide();

    this._toastrService.success("Empresa actualizada.", "Exito");

    this.router.navigate(["../.."], { relativeTo: this.route });


  }

  public ngOnDestroy(): void {
  }





  back() {
    this.router.navigateByUrl('/home/empresas');

  }

}
