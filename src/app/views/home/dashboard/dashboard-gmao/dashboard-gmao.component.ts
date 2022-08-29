import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VirtualScrollWithPaginatorComponent } from '../../../../shared/components/virtual-scroll-with-paginator/virtual-scroll-with-paginator.component';

@Component({
  selector: 'app-dashboard-gmao',
  templateUrl: './dashboard-gmao.component.html',
  styleUrls: [
    './dashboard-gmao.component.scss',
    '../../../../../styles/home/view.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class DashboardGmaoComponent extends VirtualScrollWithPaginatorComponent implements OnInit {

  public showSpinner:boolean = false;

  public records: any[] = [1,2,3];

  constructor() {
    super(null);
  }

  ngOnInit(): void {
  }

  onSelect(item: any): void {
  }

  backToTheListing(): void {
  }


}
