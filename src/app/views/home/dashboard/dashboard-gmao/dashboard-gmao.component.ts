import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dashboard-gmao',
  templateUrl: './dashboard-gmao.component.html',
  styleUrls: [
    './dashboard-gmao.component.scss',
    '../../../../../styles/home/view.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class DashboardGmaoComponent  implements OnInit {

  viewIncident: boolean = false;
  dataIncident: any = null;

  constructor() {}

  ngOnInit(): void {
  }

  public viewDetailIncident(value: any) {
    this.dataIncident = value;
    this.viewIncident = value === false ? false: true;
  }

}
