import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ProjectWorkModuleService } from '../../../administration/project-work-module.service';
import { ModuleService } from '../../../gis/module.service';
import { resolveAll } from '@shared/helpers';
  
@Injectable()
export class TableResolverService implements Resolve<Promise<any>> 
{
  public constructor(
    private _projectWorkModuleService:ProjectWorkModuleService,
    private _moduleService:ModuleService,
  )
  {}

  public resolve(route: ActivatedRouteSnapshot): Promise<any>
  {
    return  resolveAll({
      workModules: this._projectWorkModuleService.all(),
      modules: this._moduleService.all()
    });
  }
}