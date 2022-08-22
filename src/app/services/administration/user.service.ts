import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService extends CrudService
{
  constructor(
    protected http:HttpClient
  )
  {
    super(
      http,
      'administracion/n-usuarios'
    );
  }
}