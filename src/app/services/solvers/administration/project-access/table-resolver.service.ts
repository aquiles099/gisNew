import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ProjectAccessService } from '../../../administration/project-access.service';
import { RequestedProjectService } from '../../../requested-project.service';

@Injectable()
export class TableResolverService implements Resolve<Promise<any>>
{
  public constructor(
    private _projectAccessService:ProjectAccessService,
    private _requestedProjectService:RequestedProjectService
  ){}

  public resolve(route: ActivatedRouteSnapshot): Promise<Promise<any>>
  {
    this._projectAccessService.setUrlParams({id: this._requestedProjectService.id.toString()});
    return this._projectAccessService.create();
  }
}