import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { DashboardGmaoComponent } from './dashboard-gmao/dashboard-gmao.component';
import { DashboardTellinkComponent } from './dashboard-tellink/dashboard-tellink.component';
import { DashboardGestionEnergeticaComponent } from './dashboard-gestion-energetica/dashboard-gestion-energetica.component';
import { GraphicsContentComponent } from './graphics-content/graphics-content.component';
import { GraphsViewComponent } from './graphs-view/graphs-view.component';



@NgModule({
  declarations: [
    DashboardGmaoComponent,
    DashboardTellinkComponent,
    DashboardGestionEnergeticaComponent,
    GraphicsContentComponent,
    GraphsViewComponent
  ],
  imports: [
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
