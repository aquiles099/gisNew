import { Component, ViewChild, ElementRef, OnChanges, OnDestroy, SimpleChanges, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-graphs-view',
  templateUrl: './graphs-view.component.html',
  styleUrls: ['./graphs-view.component.scss']
})
export class GraphsViewComponent implements OnChanges {

  @Input() data: any = null;

  @ViewChild('divGraphics', { static: true }) public chartElement: ElementRef;

  highcharts = Highcharts;
  pieChartOptions: any = {
    chart: {
      renderTo: '',
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false
    },
    credits: {
      enabled: false
    },
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    tooltip: {
      pointFormat: '<b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
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
    },
    series: [
      {
        type: 'pie',
        colorByPoint: true,
        name: '',
        data: [{
          name: 'tipo 1',
          y: Number(28),
          sliced: false,
          selected: false
        }]
      }
    ]
  };

  private chart: any;

  private mySubscription: any;

  constructor(
    private router: Router,
  ) {

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

  ngOnChanges(changes: SimpleChanges): void {
    this.onLoadChart()
  }

  public onLoadChart():void
  {
    console.log('cargando graficos')
    this.pieChartOptions.title.text = 'Titulo gráfico';
    this.pieChartOptions.chart['renderTo'] = this.chartElement.nativeElement;
    this.chart = Highcharts.chart(this.pieChartOptions);
  }

}
