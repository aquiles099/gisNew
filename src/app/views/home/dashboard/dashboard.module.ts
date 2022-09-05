import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HighchartsChartModule } from 'highcharts-angular';

import { DashboardGmaoComponent } from './dashboard-gmao/dashboard-gmao.component';
import { DashboardTellinkComponent } from './dashboard-tellink/dashboard-tellink.component';
import { DashboardGestionEnergeticaComponent } from './dashboard-gestion-energetica/dashboard-gestion-energetica.component';
import { GraphsViewComponent } from './graphs-view/graphs-view.component';
import { ContentComponent } from './dashboard-gmao/content/content.component';
import { ContentDetailsComponent } from './dashboard-gmao/content-details/content-details.component';
import { CardDetailsProjectsComponent } from './card-details-projects/card-details-projects.component';

@NgModule({
  declarations: [
    DashboardGmaoComponent,
    DashboardTellinkComponent,
    DashboardGestionEnergeticaComponent,
    GraphsViewComponent,
    ContentComponent,
    ContentDetailsComponent,
    CardDetailsProjectsComponent
  ],
  imports: [
    DashboardRoutingModule,
    SharedModule,
    HighchartsChartModule
  ]
})
export class DashboardModule { }
