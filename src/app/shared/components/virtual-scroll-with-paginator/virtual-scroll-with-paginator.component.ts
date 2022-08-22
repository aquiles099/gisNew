import { Component, ViewChild, ElementRef } from '@angular/core';
import { CrudService } from '../../../services/crud.service';
import { PaginatorComponent } from '../paginator/paginator.component';

@Component({
  templateUrl: './virtual-scroll-with-paginator.component.html',
  styleUrls: ['./virtual-scroll-with-paginator.component.scss']
})
export class VirtualScrollWithPaginatorComponent extends PaginatorComponent
{
  @ViewChild('vsContainer')
  public vsContainer:ElementRef<HTMLElement>;
  
  constructor(
    protected crudService:CrudService
  )
  {
    super(crudService);
  }

  public async scrolled():Promise<void>
  {
    if( this.searching )
      return;

    try
    {
      this.startCallback();

      this.searching = true;
      
      if (this.paginator.next_page_url && this.vsContainer.nativeElement.offsetHeight + this.vsContainer.nativeElement.scrollTop >= (this.vsContainer.nativeElement.scrollHeight - 10))
      {
        this.paginator = await this.loadPaginator({page: this.paginator.current_page + 1});
        
        this.records = [...this.records, ...this.paginator.data];
      } 
      
    }
    finally
    {
      this.searching = null;
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
        this.vsContainer.nativeElement.scrollTo({top: 0});
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
