import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './table/table.component';
import { DetailsComponent } from './details/details.component';
import { PermissionManagementComponent } from './permission-management/permission-management.component';
import { AttributeSettingsComponent } from './attribute-settings/attribute-settings.component';

// resolvers
import { TableResolverService as ProjectsTableResolverService } from '@services/solvers/administration/project/table-resolver.service';
import { DetailsResolverService as ProjectDetailsResolverService } from '../../../services/solvers/administration/project/details-resolver.service';
import { TableResolverService as WorkModulesTableResolverService } from '@services/solvers/administration/project-work-module/table-resolver.service';
import { TableResolverService as ProjectAccessTableResolverService } from '../../../services/solvers/administration/project-access/table-resolver.service';

// guards
import { UserHasSomeAdminRoleGuard } from '../../../guards/user-has-some-admin-role.guard';

const routes: Routes = [
  {
    path: '',
    component: TableComponent,
    resolve: {
      resources: ProjectsTableResolverService,
    }
  },
  {
    path: ':id',
    resolve: {
      project: ProjectDetailsResolverService
    },
    children: [
      {
        path: 'detalles',
        component: DetailsComponent,
      },
      {
        path: 'administracion',
        canActivate: [UserHasSomeAdminRoleGuard],
        canActivateChild: [UserHasSomeAdminRoleGuard],
        canLoad: [UserHasSomeAdminRoleGuard],
        resolve: {},
        children: [
          {
            path: 'gestion-de-permisos',
            component: PermissionManagementComponent,
            resolve: {
              resources: ProjectAccessTableResolverService
            }
          },
          {
            path: 'configuracion-de-atributos',
            component: AttributeSettingsComponent,
            resolve: {}
          },
          {
            path: '**',
            component: DetailsComponent
          }
        ]
      },
      {
        path: '**',
        component: DetailsComponent
      }
    ]
  },
  {
    path: '**',
    component: TableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[
    ProjectsTableResolverService,
    WorkModulesTableResolverService,
    ProjectAccessTableResolverService
  ]
})
export class ProjectsRoutingModule { }
