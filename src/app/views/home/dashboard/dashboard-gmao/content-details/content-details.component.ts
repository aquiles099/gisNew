import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-content-details',
  templateUrl: './content-details.component.html',
  styleUrls: [
    './content-details.component.scss',
    '../../../../../../styles/home/view.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class ContentDetailsComponent implements OnInit, OnDestroy {

  public showSpinner:boolean = false;

  @Input() dataIncident: any = null;

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
      spacingBottom: 10,
      spacingTop: 10,
      spacingLeft: 5,
      spacingRight: 5,
      className: 'graphics-class',
      showAxes: true
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
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio"
        ],
        crosshair: true,
        visible: true,
        gridLineColor: "#636363",
        gridLineWidth: 1,
        startOnTick: true,
        endOnTick: true,
        tickLength: 1,
        offset: 1
      }
    ],
    yAxis: [
      {
        // Primary yAxis
        labels: {
          format: "{value}",
          style: {
            color: "#00204A"
          }
        },
        title: {
          text: "",
          style: {
            display: 'none'
          }
        },
        gridLineColor: "#636363",
        gridLineWidth: 1
      },
      {
        // Secondary yAxis
        title: {
          text: "",
          style: {
            display: 'none'
          }
        },
        labels: {
          format: "{value}",
          style: {
            color: "#00204A"
          }
        },
        opposite: true,
        gridLineColor: "#636363"
      },
      {
        // Secondary yAxis
        title: {
          text: "",
          style: {
            display: 'none'
          }
        },
        labels: {
          format: "{value}",
          style: {
            color: "#00204A"
          }
        },
        opposite: true,
        gridLineColor: "#636363"
      }
    ],
    tooltip: {
      shared: true
    },
    series: [
      {
        name: "S??rie 1",
        type: "column",
        color: "#FF4069",
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
        name: "S??rie 2",
        type: "spline",
        color: "#FFCD56",
        yAxis: 0,
        data: [77.0, 86.9, 109.5, 114.5, 128.2, 148.3]
      },
      {
        name: "S??rie 3",
        type: "spline",
        color: "#36A2EB",
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

  public chart: any;

  constructor(
    private router: Router,
  ) {
  }

  ngOnDestroy() {
  
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
