import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ProjectService } from '../../administration/project.service';
import { resolveAll } from '@shared/helpers';
import { MapResourceService } from '../../gis/map/map-resource.service';

@Injectable()
export class MapResolverService implements Resolve<Promise<any>> 
{
  public constructor(
    private _mapResourceService:MapResourceService,
    private _projectService:ProjectService,
  )
  {}

  public resolve(route: ActivatedRouteSnapshot): Promise<any>
  {
    return  resolveAll({
      toolsAndModules: this._mapResourceService.getToolsAndModulesForAuthUserOnProject(),
      projects: this._projectService.getSimpleList()
    });
  }}
