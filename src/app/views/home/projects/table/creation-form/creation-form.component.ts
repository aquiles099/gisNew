import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SpinnerService } from '@services/spinner.service';
import { ProvinceService } from '@services/locations/province.service';
import { Province } from '@interfaces/province';
import { Module } from '@interfaces/module';
import { resolveAll, delayExecution } from '@shared/helpers';
import { Company } from '@interfaces/company';
import { Municipality } from '@interfaces/municipality';
import { HiringPlan } from '@interfaces/hiring-plan';
import { checkIfTheFileExtensionIsCorrect } from '@shared/helpers';
import { getFileContent } from 'src/app/shared/helpers';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from '@services/administration/project.service';
import { NgForm } from '@angular/forms';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { AuthUserService } from '../../../../../services/auth-user.service';
import { User } from '@models/user';
import { Project } from '../../../../../interfaces/project';

const ANIMATION_DURATION = 500;

@Component({
  selector: 'project-creation-form',
  templateUrl: './creation-form.component.html',
  styleUrls: [
    './creation-form.component.scss',
    '../../../../../../styles/home/view.scss',
  ],
  animations: [
    fadeInOnEnterAnimation({duration: ANIMATION_DURATION}),
    fadeOutOnLeaveAnimation({duration: ANIMATION_DURATION})
  ]
})
export class CreationFormComponent
{
  private _isVisible:boolean = false;
  
  // variable para detectar momento previo antes de abrir o cerrar el 
  // modal para desarrollar animacion fadeIn / fadeOut
  public showing:boolean = false;

  @Input()
  public modules:Module[] = [];
  
  public companies:Partial<Company>[] = [];
  public provinces:Partial<Province>[] = [];
  public municipalities:Partial<Municipality>[] = [];
  public hiringPlans:Partial<HiringPlan>[] = [];

  public loadingMunicipalities:boolean = false; 

  public logoSrc:string = "assets/images/camara.png";

  @ViewChild(NgForm)
  public ngForm:NgForm;

  public form:{[key:string]:any};

  public selectedModule:string;

  @Output()
  public onCreateProject:EventEmitter<void> = new EventEmitter;

  constructor(
    private _authUserService:AuthUserService,
    private _projectService:ProjectService,
    private _provinceService:ProvinceService,
    private _spinnerService:SpinnerService,
    private router:Router,
    private _toastrService:ToastrService
  )
  {
    this.form = {
      title: null,
      company_id: null,
      municipality_id: null,
      logo: null,
      modules:{}
    };
  }

  get isVisible():boolean
  {
    return this._isVisible;
  }
 
  get user():User
  {
    return this._authUserService.user;
  }

  public async show():Promise<void>
  {
    try
    {
      this._spinnerService.show([
        "Cargando datos...",
        "Por favor, espere...",
      ]);

      const resources = await this._projectService.create();

      this.companies = resources['companies'];
      this.provinces = resources['provinces'];
      this.hiringPlans = resources['hiring_plans'];

      for(let module of this.modules)
      {
        this.form.modules[module.name] = {
          selected: false,
          id: module.id,
          hiring_plan_id: null
        };
      }

      this.showing = this._isVisible = true;

    }
    catch(error)
    {
      this.hide();

    }
    finally
    {
      this._spinnerService.hide();
    }
  }

  public async onSelectLogo(event:any):Promise<void>
  {
    try
    {
      const file = event.target.files[0];
  
      if(file)
      {
        if( ! checkIfTheFileExtensionIsCorrect([file], ["jpg","jpeg","png"]) )
          throw new Error("El archivo debe ser una imagen con extensión jpg, jpeg o png");

        this.logoSrc = await getFileContent(file, "dataURL");
      }

    } catch (error)
    {
      console.error(error);
      this._toastrService.warning(error.message,"Aviso");
      event.target.value = null;
    }
  }

  public async onChangeProvinceSelector(province:Partial<Province>):Promise<void>
  {
    try {
      
      this.loadingMunicipalities = true;
            
      this.municipalities = await this._provinceService.getMunicipalities(province.id);

      this.form.municipality_id = null;
    }
    catch (error)
    {
      this._toastrService.error(error.message, "Error");
    }
    finally
    {
      this.loadingMunicipalities = false;
    }
  }

  public onSelectModule(module:Module):void
  {
    this.selectedModule = module.name; 

    if(module.name === 'base')
    {
      const premmiumHiringPlan = this.hiringPlans.find(plan => plan.name.toLowerCase() === 'premium');
      this.form.modules['base'].hiring_plan_id = premmiumHiringPlan.id;
    }
  }

  public async onSubmit(event:any):Promise<void>
  {
    try {

      this._spinnerService.show([
        '<h1>Creando proyecto...</h1>',
        '<h1>Esto puede demorarse un poco...</h1>',
        '<h1>Por favor, espere...</h1>',
        '<h1>Generando estructura de capas...</h1>'
      ]);
      
      const formData = new FormData(event.target);
      
      formData.append("municipality_id", this.form['municipality_id']);

      const selectedModules = this.getSelectedModules();

      selectedModules.forEach((module,index) => {

        formData.append(`modules[${index}][id]`, module.id);
        formData.append(`modules[${index}][hiring_plan_id]`, module.hiring_plan_id);

      });

      formData.append("company_id", this.form['company_id']);

      await this._projectService.store(formData); 

      await swal.fire({
        title: "OK",
        text: "Proyecto registrado.",
        icon: "success",
        // timer: 2000
      });
 
      // this.router.navigateByUrl(`/gis/proyectos/${project.id}/configurar-capas`);

      this.onCreateProject.emit();

      this.hide();

    }
    catch (error)
    {
    }
    finally
    {
      this._spinnerService.hide();
    }
  }

  private getSelectedModules():any[]
  {
    try {

      const selectedModules:any[] = Object.values(this.form.modules).filter((module:any) => module.selected);

      if( ! selectedModules.length )
        throw new Error("Debe seleccionar al menos 1 modulo.");
        
      const allModulesHaveAHiringPlan = selectedModules.every(module => module.hiring_plan_id);

      if( ! allModulesHaveAHiringPlan )
        throw new Error("Confirme que todos los modulos seleccionados tengan un plan de contratación.");


      return selectedModules;
        
    } catch (error)
    {
      this._toastrService.warning(error.message,"Aviso");
      throw error;
    }
  }

  public async hide():Promise<void>
  {
    this.ngForm.reset();
  
    this.logoSrc = "assets/images/camara.png";
  
    this.companies = [];
    this.provinces = [];
    this.municipalities = [];
    this.hiringPlans = [];

    this.loadingMunicipalities = false;

    this.selectedModule = null;

    this.showing = false;
    
    // leve retraso para desarrollar animacion de fadeOut
    await delayExecution(500);

    this._isVisible = false;
  }

}
