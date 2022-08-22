import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ProjectsRoutingModule } from './projects-routing.module';

import { TableComponent } from './table/table.component';
import { DetailsComponent } from './details/details.component';
import { PermissionManagementComponent } from './permission-management/permission-management.component';
import { AttributeSettingsComponent } from './attribute-settings/attribute-settings.component';

// services
import { ProjectService } from '../../../services/administration/project.service';
import { ProjectWorkModuleService } from '@services/administration/project-work-module.service';
import { ProjectAccessService } from '../../../services/administration/project-access.service';
import { CreationFormComponent } from './table/creation-form/creation-form.component';
import { ModuleService } from '../../../services/gis/module.service';
import { ProvinceService } from '../../../services/locations/province.service';
import { HiringPlanService } from '../../../services/administration/hiring-plan.service';
import { CompanyService } from '../../../services/administration/company.service';

@NgModule({
  declarations: [
    PermissionManagementComponent,
    TableComponent,
    DetailsComponent,
    AttributeSettingsComponent,
    CreationFormComponent,
  ],
  imports: [
    SharedModule,
    ProjectsRoutingModule,
  ],
  providers: [
    ProjectService,
    ProjectWorkModuleService,
    ProjectAccessService,
    ModuleService,
    ProvinceService,
    CompanyService,
    HiringPlanService
  ]
})
export class ProjectsModule { }
