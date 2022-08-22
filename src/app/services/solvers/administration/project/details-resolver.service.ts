import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Project } from '@interfaces/project';
import { ProjectService } from '../../../administration/project.service';
import { RequestedProjectService } from '../../../requested-project.service';

@Injectable({
  providedIn: "root"
})
export class DetailsResolverService implements Resolve<Promise<Project>>
{
  public constructor(
    private _projectService:ProjectService,
    private _requestedProjectService:RequestedProjectService
  )
  {}

  public async resolve(route: ActivatedRouteSnapshot):  Promise<Project> 
  {
    const projectId = route.params['id'];
    const project =  await this._projectService.show(projectId);

    this._requestedProjectService.next(project);

    return project;
  }
}
