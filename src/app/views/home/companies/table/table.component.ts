import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild,ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

//services
import { ToastrService } from 'ngx-toastr';
import { CompanyService as CRUDService } from '../../../../services/administration/company.service';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  templateUrl: './table.component.html',
  styleUrls: [
    './table.component.scss',
    '../../../../../styles/home/view.scss'
  ]
})
export class TableComponent implements OnInit {

  @ViewChild(PaginationComponent, { static: true }) paginator: PaginationComponent;
  @ViewChild('spinner', { static: true }) template_spinner: ElementRef;

  public companies: any = [];
  private _unsubscribeAll: Subject<any>;
  // for pagination
  total: any;
  pageOffset: any;
  pageIndex: any;

  constructor(
    private _crudService: CRUDService,
    private spinner: NgxSpinnerService,
    private _toastrService: ToastrService,
    private router: Router

  ) {

    this._unsubscribeAll = new Subject();


  }

  ngOnInit(): void {
    this.pageOffset = 10;
    this.pageIndex = 1;
  }

  init(): void {
    this.spinner.show();

    let data = { pageOffset: this.pageOffset, page: this.pageIndex };

    this._crudService.getDataTable(data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.spinner.hide();
        this.total = response.meta.total;

        this.companies = response.data;


      });

  }

  ngAfterViewInit(): void {
    // after paginate state update in pagination component
    /*this.paginator.paginate.pipe(takeUntil(this._unsubscribeAll)).subscribe(paginator => {

      this.pageIndex = paginator.page;
      this.pageOffset = paginator.pageOffset;

      this.init();
    });*/

  }

  onSearch(el: HTMLInputElement): void {

    let data = { search: el.value }

        this.template_spinner.nativeElement.classList.remove("hidden");
        this.template_spinner.nativeElement.classList.add("show_spin");
    this._crudService.getDataTable(data)
      .subscribe(response => {
        this.template_spinner.nativeElement.classList.remove("show_spin");
        this.template_spinner.nativeElement.classList.add("hidden");
        this.companies = response.data;


      });


  }

  edit(id: any): void {
    this.router.navigate([`/home/empresas/${id}/editar`]);

  }

  show(id: any): void {
    this.router.navigate([`/home/empresas/${id}/detalles`]);

  }

  public async delete(id: any):Promise<void>
  {
    const userResponse = await swal.fire({
      title: 'Desea eliminar la empresa?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    });
    
    /* Read more about isConfirmed, isDenied below */
    if (userResponse.isConfirmed)
    {
      this.spinner.show();

      await this._crudService.delete(id);

      this.init();
      this._toastrService.success("Empresa eliminada", "Exito");
      this.spinner.hide();

    } 
  }

  orderBy(value: any, el: HTMLElement) {
    let type: any;

    if (el.classList.contains('top-caret')) {
      el.classList.remove('top-caret')
      el.classList.add('down-caret')

      type = 'ASC';
    }
    else {

      el.classList.remove('down-caret')
      el.classList.add('top-caret')

      type = 'DESC';

    }
    this.spinner.show();

    let data: any;
    data = { order_by: value, order_type: type,pageOffset:10 }

  


    this._crudService.getDataTable(data)
      .subscribe(response => {

        this.spinner.hide();

        this.companies = response.data;


      });

  }


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }



}
