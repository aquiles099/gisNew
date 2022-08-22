import { Injectable } from '@angular/core';
import {
	Resolve,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';
import {Observable, of} from 'rxjs';

import { UserService } from '../../../user.service';

@Injectable()
export class EditResolverService implements Resolve<any>
{
  constructor(
  	private _model:UserService
  ) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
  {
      const id = Number(route.paramMap.get('id'));

  		return this._model
  					   .show(id);
  }





}

