import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ShowComponent } from './show/show.component';


//services
import { CompanyService  } from '../../../services/administration/company.service';
import { SharedModule } from '../../../shared/shared.module';
import { ProvinceService  } from '../../../services/locations/province.service';


@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
    EditComponent,
    ShowComponent
    
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    SharedModule
  ],
  providers: [
    CompanyService,
    ProvinceService 
  ]
})
export class CompanyModule { }
