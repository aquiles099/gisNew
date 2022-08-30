import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { VirtualScrollWithPaginatorComponent } from '../../../../../shared/components/virtual-scroll-with-paginator/virtual-scroll-with-paginator.component';

@Component({
  selector: 'app-content-details',
  templateUrl: './content-details.component.html',
  styleUrls: [
    './content-details.component.scss',
    '../../../../../../styles/home/view.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class ContentDetailsComponent extends VirtualScrollWithPaginatorComponent implements OnInit, OnDestroy {

  public showSpinner:boolean = false;

  @Input() data: any = null;

  @ViewChild('divGraphics', { static: true }) public chartElement: ElementRef;

  highcharts = Highcharts;
  pieChartOptions: any = {
    chart: {
      renderTo: '',
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      zoomType: "xy",
      backgroundColor: 'transparent',
      spacingBottom: 5,
      spacingTop: 10,
      spacingLeft: 5,
      spacingRight: 5,
      className: 'graphics-class'
    },
    credits: {
      enabled: false
    },
    title: {
      text: '',
      style: {
          display: 'none'
      }
    },
    subtitle: {
      text: '',
      style: {
          display: 'none'
      }
    },
    xAxis: [
      {
        categories: [
          "x1",
          "x2",
          "x3",
          "x4",
          "x5",
          "x6"
        ],
        crosshair: true
      }
    ],
    yAxis: [
      {
        // Primary yAxis
        labels: {
          format: "{value}",
          style: {
            color: "#7cb5ec"
          }
        },
        title: {
          text: "Unidade de Medida 1",
          style: {
            display: 'none'
          }
        }
      },
      {
        // Secondary yAxis
        title: {
          text: "Unidade de Medida 2",
          style: {
            display: 'none'
          }
        },
        labels: {
          format: "{value}",
          style: {
            color: "#0d233a"
          }
        },
        opposite: true
      },
      {
        // Secondary yAxis
        title: {
          text: "Unidade de Medida 3",
          style: {
            display: 'none'
          }
        },
        labels: {
          format: "{value}",
          style: {
            color: "#8bbc21"
          }
        },
        opposite: true
      }
    ],
    tooltip: {
      shared: true
    },
    series: [
      {
        name: "Série 1",
        type: "column",
        color: "#7cb5ec",
        yAxis: 0,
        data: [
          49.9,
          71.5,
          86.4,
          89.2,
          104.0,
          65.0
        ]
      },
      {
        name: "Série 2",
        type: "spline",
        color: "#0d233a",
        yAxis: 0,
        data: [77.0, 86.9, 109.5, 114.5, 128.2, 148.3]
      },
      {
        name: "Série 3",
        type: "spline",
        color: "#8bbc21",
        yAxis: 0,
        data: [84.0, 93.9, 76.5, 91.5, 105.2, 122.3]
      }
    ],
    legend:{
      align: 'center',
      verticalAlign: 'top',
      floating: false,
      itemStyle: {
        display: 'none'
      }
    }
  };

  private chart: any;

  private mySubscription: any;

  constructor(
    private router: Router,
  ) {
    super(null);

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.onLoadChart()
  }

  public onLoadChart():void
  {
    console.log('cargando graficos')
    this.pieChartOptions.chart['renderTo'] = this.chartElement.nativeElement;
    this.chart = Highcharts.chart(this.pieChartOptions);
  }

}
