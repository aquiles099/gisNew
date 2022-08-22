import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GisToolGroupService extends CrudService
{
  constructor(
    protected httpClient:HttpClient
  )
  {
    super(
      httpClient,
      'gis/proyectos/:id/herramientas-de-mapa'
    )
  }
}
