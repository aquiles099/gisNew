import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild,ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../../services/spinner.service';
import { AuthUserService } from '../../../../services/auth-user.service';
import { User as UserInterface } from 'src/app/interfaces/user';
import { User } from 'src/app/models/user';
import { UserService } from '@services/administration/user.service';
import { LaravelPaginator } from '../../../../interfaces/laravel-paginator';
import { Project } from '../../../../interfaces/project';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { showPreconfirmMessage } from '@shared/helpers';

interface UserData extends UserInterface
{
  "full_name_initials": string;
  "color": string;
  "projects": Partial<Project>[];
}

@Component({
  templateUrl: './table.component.html',
  styleUrls: [
    './table.component.scss',
    '../../../../../styles/home/view.scss'
  ]
})
export class TableComponent extends PaginatorComponent implements OnInit {

  public showSpinner:boolean = false;

  constructor(
    protected _userService: UserService,
    private _spinnerService: SpinnerService,
    private _authUserService: AuthUserService,
    private _toastrService: ToastrService,
    private router: Router,

  )
  {
    super(_userService);

    this.startCallback = () => this.showSpinner = true;
    
    this.endCallback = () => this.showSpinner = false;;

    this.searchFields = ['search'];
  }

  get authUser():User
  {
    return this._authUserService.user;
  }

  public ngOnInit(): void
  {
    this.loadRecords();
  }

  public async toggleActiveStateOfTheUser(user:UserInterface):Promise<void>
  {
    try
    {
      this._spinnerService.show((user.is_active ? "Activando" : "Desactivando") + "  usuario...");

      await this._userService.update(user.id, {is_active: user.is_active});
    }
    finally
    {
      this._spinnerService.hide()
    }
  }

  public async deleteUser(user:UserInterface):Promise<void>
  {
    try
    {
      const userResponse = await showPreconfirmMessage(
        "Eliminar usuario?",
        "Esta acción no es reversible."
      );

      if( userResponse.isConfirmed )
      {
        this._spinnerService.show("Eliminando usuario...");
  
        await this._userService.delete(user.id);
  
        this.records = this.records.filter(_user => _user.id !== user.id);
    
        this._toastrService.success("Usuario eliminado.","OK");
      }

    }
    finally
    {
      this._spinnerService.hide()
    }
  }

}
