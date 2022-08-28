import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardGmaoComponent } from './dashboard-gmao/dashboard-gmao.component';
import { DashboardTellinkComponent } from './dashboard-tellink/dashboard-tellink.component';
import { DashboardGestionEnergeticaComponent } from './dashboard-gestion-energetica/dashboard-gestion-energetica.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'tablero/gmao',
        pathMatch: 'full'
    },
    {
        path: 'gmao',
        component: DashboardGmaoComponent
    }
    ,
    {
        path: 'tellink',
        component: DashboardTellinkComponent
    },
    {
        path: 'gestion-energetica',
        component: DashboardGestionEnergeticaComponent
    }
    ,
    {
        path: '**',
        component: DashboardGmaoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule { }
  