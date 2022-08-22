import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { UsersRoutingModule } from './users-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ShowComponent } from './show/show.component';

//pipes

//services
import { UserService  } from '../../../services/user.service';
import { SharedModule } from '../../../shared/shared.module';
import { UserService as _UserService} from '../../../services/administration/user.service';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
    EditComponent,
    ShowComponent
    
  ],
  imports: [
    SharedModule,
    UsersRoutingModule,
    TooltipModule
  ],
  providers: [
    UserService,
    _UserService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class UsersModule { }
