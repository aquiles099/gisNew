import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HiringPlanService extends CrudService
{
  constructor(
    protected httpClient:HttpClient
  ) {
    super(
      httpClient,
      'administracion/planes-de-contratacion'
    )
   }}
