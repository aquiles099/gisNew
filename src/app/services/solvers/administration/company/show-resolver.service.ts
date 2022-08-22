import { Injectable } from '@angular/core';
import {
	Resolve,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';
import {Observable, of} from 'rxjs';

import { CompanyService } from '../../../administration/company.service';

import { map,catchError } from 'rxjs/operators';

@Injectable()
export class ShowResolverService implements Resolve<any>
{
  constructor(
  	private _model:CompanyService
  ) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any>
  {
      const id = Number(route.paramMap.get('id'));

  		return this._model
  					   .show(id);
  }





}

