import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-graphs-view',
  templateUrl: './graphs-view.component.html',
  styleUrls: ['./graphs-view.component.scss']
})
export class GraphsViewComponent implements OnInit, OnDestroy {

  @Input() data: any = null;

  @ViewChild('divGraphics', { static: true }) public chartElement: ElementRef;

  highcharts = Highcharts;
  pieChartOptions: any = {
    chart: {
      renderTo: '',
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      zoomType: "xy"
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
          "x6",
          "x7",
          "x8",
          "x9",
          "x10"
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
    /* plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
          color: '#000000',
          connectorColor: '#000000'
        },
        showInLegend: true
      }
    }, */
    series: [
      {
        name: "Série 1",
        type: "column",
        color: "#7cb5ec",
        yAxis: 0,
        data: [
          49.9,
          71.5,
          106.4,
          129.2,
          144.0,
          176.0,
          135.6,
          148.5,
          210.4,
          194.1
        ]
      },
      {
        name: "Série 2",
        type: "spline",
        color: "#0d233a",
        yAxis: 1,
        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3]
      },
      {
        name: "Série 3",
        type: "spline",
        color: "#8bbc21",
        yAxis: 2,
        data: [4.0, 3.9, 6.5, 11.5, 15.2, 18.5, 22, 23.5, 20.3, 12.3]
      }
    ]
  };

  private chart: any;

  private mySubscription: any;

  constructor(
    private router: Router,
  ) {
    console.log('grafico');
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
