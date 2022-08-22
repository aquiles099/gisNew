import { Injectable } from '@angular/core';
import { CrudService } from '../crud-service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProjectRoleService extends CrudService
{
  constructor(
    protected http:HttpClient
  )
  {
    super(
      http,
      'administracion/roles-de-proyecto'
    );
  }
}
