import { Component, OnInit } from '@angular/core';
import { LaravelPaginator } from '../../../interfaces/laravel-paginator';
import { CrudService } from '../../../services/crud.service';

@Component({
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent 
{
  public paginator:LaravelPaginator;
  public records:any[] = [];

  public searching:any;

  public search:string = null;
  protected lastSearch:string = null;
  protected searchDelay:number = 300;
  protected searchFields:string[] = [];

  public fixedParams: {[key:string]:string|number};
  protected startCallback: () => any;
  protected loadPaginator: (params?:{[key:string]:string|number}) => Promise<LaravelPaginator>;
  public responseHandler: (response:any) => LaravelPaginator;
  protected endCallback: () => any;
  
  constructor(
    protected crudService:CrudService
  )
  {
    this.loadPaginator = async (params:{[key:string]:string} = {}) =>  {
          
      if( this.search )
      {
        for(let key of this.searchFields)
          params[key] = this.search.trim();
      }

      if( this.fixedParams )
      {
        for(let [key, value] of Object.entries(this.fixedParams))
          if( value )    
            params[key] = (value as string);
      }

      let paginator,
          response = await (crudService.all(params) as Promise<LaravelPaginator>);

      paginator = this.responseHandler ?
      this.responseHandler(response) :
      response;

      return paginator;
    };
  }

  public nextPage():void
  {
    this.loadRecords({page: this.paginator.current_page + 1});
  }

  public prevPage():void
  {
    this.loadRecords({page: this.paginator.current_page - 1});
  }
 
  public async loadRecords(params:{[key:string]:string|number} = {}):Promise<void>
  {
    try
    {
      this.startCallback();
      this.paginator = await this.loadPaginator(params);
      this.records = [...this.paginator.data];
    }
    finally
    {
      this.endCallback();
    }
  }
 
  public async onSearch(event:any):Promise<void>
  {
    if(
      (! this.lastSearch && ( ! this.search || ! this.search.trim().length ) ) ||
      this.lastSearch === this.search.trim()
      )
      return;

    if( this.searching )
      clearTimeout(this.searching);

    this.searching = setTimeout(async () => {

      try
      {
        this.startCallback();
  
        this.lastSearch = this.search.trim();
  
        this.paginator = await this.loadPaginator();
        this.records = [...this.paginator.data];
      }
      finally
      {
        this.searching = false;
        this.endCallback();
      }

    }, this.searchDelay);

  }

}
