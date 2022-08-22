import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ProjectRoleService } from '../../../administration/project-role.service';
  
@Injectable()
export class TableResolverService implements Resolve<Promise<any>> 
{
  public constructor(
    private _projectRoleService:ProjectRoleService
  )
  {}

  public resolve(route: ActivatedRouteSnapshot): Promise<any>
  {
    return this._projectRoleService.all();
  }
}