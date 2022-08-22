import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from '@interfaces/project';
import { ProjectService } from '../../../../services/administration/project.service';
import { AuthUserService } from '../../../../services/auth-user.service';
import { VirtualScrollWithPaginatorComponent } from '../../../../shared/components/virtual-scroll-with-paginator/virtual-scroll-with-paginator.component';
import { CreationFormComponent } from './creation-form/creation-form.component';
import { Module } from '../../../../interfaces/module';
import { showPreconfirmMessage } from '@shared/helpers';
import { SpinnerService } from '../../../../services/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '@models/user';

interface ProjectOption
{
  name: string;
  path?:string[];
  label:string;
  action?: (params?:any) => any;
}

@Component({
  templateUrl: './table.component.html',
  styleUrls: [
    './table.component.scss',
    '../../../../../styles/home/view.scss'
  ]
})
export class TableComponent extends VirtualScrollWithPaginatorComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
  private routeDataSubscription:Subscription;
    
  public project:Project;

  public baseRoutes:ProjectOption[] = [
    {
      name: "gis-map",
      path:['/gis','proyectos',':id','mapa'],
      label: 'Ir al mapa',
    },
  ];

  public administrationRoutes:ProjectOption[] = [
    {
      name: "permission-management",
      path:[':id','administracion','gestion-de-permisos'],
      label: 'Gestionar permisos',
    },
    {
      name: "attribute-setting",
      path:[':id','administracion','configuracion-de-atributos'],
      label: 'Configurár atributos',
    },
    {
      name: "layer-management",
      path:['/gis','proyectos',':id','configurar-capas'],
      label: 'Gestionar capas',
    },
    {
      name: "delete-project",
      label: 'Eliminar proyecto',
      action: project =>  this.deleteProject(project)
    }
  ];
 
  public options:ProjectOption[] = [];

  public sortCriteria:'title'|'id' = 'id';
  public sortMode:'asc'|'desc' = 'desc';
  
  public modules:Module[] = [];
    
  public categoryOptions:{label:string, value:string}[] = [
    {label:"Todos", value: "" }
  ];

  public showSpinner:boolean = false;
    
  @ViewChild(CreationFormComponent)
  public creationForm:CreationFormComponent;

  constructor(
    private route:ActivatedRoute,
    protected _projectService:ProjectService,
    private _authUserService:AuthUserService,
    private _spinnerService:SpinnerService,
    private _toastrService:ToastrService,
    private _changeDetectorRef:ChangeDetectorRef
  ) {
    super(_projectService);
    
    this.startCallback = () => this.showSpinner = true;
    
    this.endCallback = () => {
      
      this.showSpinner = false;
      
      if( this.records.length === 1 )
        this.onSelectProject( this.records[0] );

      this.records = this.records.map(project => {

        // atributo para indicar que un proyecto se esta actualizando.
        project['updating'] = false;
        
        return project;
      })

    };

    this.searchFields = ['title'];

    this.fixedParams = {
      category: ""
    };

   }
  
  get user():User
  {
    return this._authUserService.user;
  }

  public ngOnInit(): void
  {
    if( this.user.hasSomeAdminRole )
      this.baseRoutes.push(...this.administrationRoutes);

    if( ! this.user.isAdmin )
      this.categoryOptions.push({label:"Favoritos", value: "favourite" });

    this.routeDataSubscription = this.route.data.subscribe(data => {

      const {workModules, modules} = data['resources'];

      this.modules = modules;

      for(let module of modules)
        this.categoryOptions.push({label: module.display_name, value: module.name});

      // workModules.forEach(module => this.baseRoutes.push({
      //     name: module.name,
      //     path: [':id', module.key],
      //     label: module.display_name
      //   })
      // ); 
      
    });
  }

  public ngAfterViewInit():void
  {
    this.loadRecords();
  }

  public async loadRecords(): Promise<void>
  {
    await super.loadRecords();
    
    this.records.length === 1 ?
    this.onSelectProject( this.records[0] ) :
    this.project = null;
  }

  public ngAfterViewChecked(): void
  {  
   this._changeDetectorRef.detectChanges();
  }

  public ngOnDestroy(): void 
  {
   this.routeDataSubscription.unsubscribe(); 
  }

  public sortProjects():void
  {
    this.records.sort((a:Project, b:Project) => {

        let _a = a, _b = b;

        if( this.sortMode === "desc" )
        {
            _a = b;
            _b = a;
        }

        let valueA:any = _a[this.sortCriteria],
            valueB:any = _b[this.sortCriteria],
            result;

        if( ! isNaN(valueA) && ! isNaN(valueB) )
        {
            result = valueA - valueB;
        }
        else
        { 
          valueA = valueA.charAt(0).toLowerCase();
          valueB = valueB.charAt(0).toLowerCase();

          switch(true)
          {
              case valueA > valueB :
                  result = 1;
                  break;
              case valueA < valueB :
                  result = -1;
                  break;
              case valueA === valueB :
                  result = 0;
                  break;
          }
        }      

        return result;
    });

  }

  public onChangeSortMode():void
  {
    this.sortMode = this.sortMode === 'asc' ? 'desc' : 'asc';
    this.sortProjects();
  }

  public onLoadMunicipalityImage(imgContainer:HTMLElement, spinnerContainer:HTMLElement):void
  {
    spinnerContainer.remove();
    imgContainer.classList.remove("d-none");
  }
 
  public onSelectProject(project:Project):void
  {
    this.options = this.baseRoutes
                        .map(option => {

                          const _option = Object.assign({},option);

                          if( _option.path )
                          {
                            _option.path = option.path.map(segment => {
                              
                              if( segment === ":id")
                                segment = project.id.toString();
                        
                                return segment;
                            });
                          }

                          return _option;

                        });

    this.project = project;
  }

  public async toggleFavouriteStateOnProject(project:Project, event:any):Promise<void>
  {
    try
    {
      event.stopPropagation();
      project['updating'] = true;
      await this._projectService.update(project.id, {favourite: ! project.favourite});
      project.favourite = ! project.favourite;
    } 
    finally
    {
      project['updating'] = false;
    }
  }

  public async deleteProject(project:Project):Promise<void>
  {
    try
    {
      const userResponse = await showPreconfirmMessage(
        "¿Estas seguro?",
        `¿Eliminar proyecto ${project.title}?. <br> <b>Esta acción no es reversible</b>.`
      );
  
      if( userResponse.isConfirmed )
      {
        this._spinnerService.show([
          "Eliminando proyecto...",
          "Esto puede demorarse un poco...",
          "Por favor, espere...",
        ]);

        await this._projectService.delete(project.id);

        if( this.project?.id === project.id )
          this.project = null;

        this.records = this.records.filter(_project => _project.id !== project.id); 

        this._toastrService.success("Proyecto eliminado","OK");
      }
    }
    finally
    {
      this._spinnerService.hide();
    }
  }

  public backToTheListing():void
  {
    this.project = null;
  }
}
