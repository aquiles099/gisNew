import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ProjectWorkModuleService } from '@services/administration/project-work-module.service';
  
@Injectable()
export class TableResolverService implements Resolve<Promise<any>> 
{
  public constructor(
    private _projectWorkModuleService:ProjectWorkModuleService
  )
  {}

  public resolve(route: ActivatedRouteSnapshot): Promise<any>
  {
    return this._projectWorkModuleService.all();
  }
}