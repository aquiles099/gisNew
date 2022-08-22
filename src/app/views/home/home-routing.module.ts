import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { InternalServerErrorComponent } from './errors/internal-server-error/internal-server-error.component';
import { UnauthorizedComponent } from './errors/unauthorized/unauthorized.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children:[
      {
        path: '',
        redirectTo: 'tablero',
        pathMatch: 'full'
      },
      {
        path: 'tablero',
        component: DashboardComponent
      },
      {
        path: 'proyectos',
        loadChildren: () => import('../home/projects/projects.module').then(m => m.ProjectsModule)
      },
      {
        path: 'usuarios',
        loadChildren: () => import('../home/users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'empresas',
        loadChildren: () => import('../home/companies/company.module').then(m => m.CompanyModule)
      },
      {
        path: 'perfil',
        component: ProfileSettingsComponent
      },
      {
        path: 'error-interno',
        component: InternalServerErrorComponent
      },
      {
        path: 'no-autorizado',
        component: UnauthorizedComponent
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
