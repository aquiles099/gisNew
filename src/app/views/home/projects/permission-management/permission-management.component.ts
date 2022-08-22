import { Component, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute} from '@angular/router';
import { Project } from '../../../../interfaces/project';
import { ProjectAccessService } from '../../../../services/administration/project-access.service';
import swal from 'sweetalert2';
import { SpinnerService } from '../../../../services/spinner.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { NgSelectComponent } from '@ng-select/ng-select';
import { VirtualScrollWithPaginatorComponent } from '../../../../shared/components/virtual-scroll-with-paginator/virtual-scroll-with-paginator.component';
import { LaravelPaginator } from '../../../../interfaces/laravel-paginator';

@Component({
  templateUrl: './permission-management.component.html',
  styleUrls: [
    './permission-management.component.scss',
    '../../../../../styles/home/view.scss'
  ]
})
export class PermissionManagementComponent extends VirtualScrollWithPaginatorComponent implements OnInit
{
  private routeDataSubscription:Subscription;

  public project:Project;

  public accessesGiven:number;

  public modules:any[] = [];
  public roles:any[] = [];
  public workModules:any[] = [];

  public editionEnabled:boolean = false;

  public showSpinner:boolean = false;

  private moduleAccessesToShare:{user_id:number, contract_id:number}[] = [];
  
  constructor(
    private route:ActivatedRoute,
    protected _projectAccessService:ProjectAccessService,
    private _toastrService:ToastrService,
    private _spinnerService:SpinnerService
  ) { 
    super(
      _projectAccessService
    );

    this.startCallback = () => this.showSpinner = true;
    this.endCallback = () => this.showSpinner = false;
    this.searchFields = ['name'];

    this.responseHandler = res => {

      this.accessesGiven = res['accesses_given'];
      return ( res['paginator'] as LaravelPaginator );
    };
    
  }

  public ngOnInit(): void
  {
    this.routeDataSubscription = this.route.data.subscribe(data => {
      
      this.project = data['project'];

      const {modules, roles, work_modules} = data['resources'];

      this.modules = modules;
      this.roles = roles;
      this.workModules = work_modules;
      
      this.loadRecords();

    });
  }

  public ngOnDestroy(): void 
  {
   this.routeDataSubscription.unsubscribe(); 
  }

  public enableEdition():void
  {
    this.editionEnabled = true;
  }
  
  public undoChanges():void
  {
    this.editionEnabled = false;
    this.moduleAccessesToShare = [];
    this.loadRecords();
  }
  
  public async saveChanges():Promise<void>
  {
    try
    {
      this._spinnerService.show();
      
      const data = {};
      
      data['users'] = this.records;

      if( this.moduleAccessesToShare.length )
        data['module_accesses'] = this.moduleAccessesToShare;

      await this._projectAccessService.store(data);

       Swal.fire({
          title: 'OK.',
          text: 'Permisos actualizados.',
          icon: 'success',
          confirmButtonText: "OK",
          timer: 1000,
          heightAuto: false
        });

      this.editionEnabled = false;

      this.moduleAccessesToShare = [];
      
      this.loadRecords();

    }
    catch(error)
    {

    }
    finally
    {
      this._spinnerService.hide();
    }
  }

  public onSelectModule(module:any, user:any, event:any, select:NgSelectComponent):void
  {
    this.setFocusOnRoleSelectorIfUserDoesntHaveRole(user,event,select);

    if(! user.role )
      return;

    if( ! event.target.checked )
    {
      this.moduleAccessesToShare = this.moduleAccessesToShare.filter(access => access.user_id !== user.id);
      user.modules[module.name] = false;
    }
    else
    {
      const totalAccesses = this.moduleAccessesToShare.filter(access => access.contract_id === module.contract_id).length;

      if( totalAccesses === module.available_spots )
      {
        swal.fire(
          'Acción invalida.',
          `Solo tiene ${module.available_spots} accesos disponibles para el modulo ${module.display_name}.`,
          'warning'
        );
  
        user.modules[module.name] = event.target.checked = false;

        return;
      }

      this.moduleAccessesToShare.push({
        contract_id: module.contract_id,
        user_id: user.id
      });
      
      user.modules[module.name] = true;
    }
  }

  public setFocusOnRoleSelectorIfUserDoesntHaveRole(user:any, event:any, select:NgSelectComponent):void
  {
    if( ! user.role )
    {
      select.open();
      event.target.checked = false;
      // this._toastrService.warning("Primero debe seleccionarle algun rol al usuario.","Aviso");
    }
  }

  public clearUserData(user:any):void
  {
    this.moduleAccessesToShare.forEach((access:any, index:number) => {
    
      if(access.user_id === user.id)
      {        
        const module  = this.modules.find(module => module.contract_id === access.contract_id);
        user.modules[module.name] = false;
      }
    
    });

    this.moduleAccessesToShare = this.moduleAccessesToShare.filter(contract => contract.user_id !== user.id);

    for(let workModule of this.workModules)
      user.work_modules[workModule.name] = false;
  }
}
