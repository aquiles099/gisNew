import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ShowComponent } from './show/show.component';

// resolvers
import { EditResolverService } from '../../../services/solvers/administration/company/edit-resolver.service';
import { ShowResolverService } from '../../../services/solvers/administration/company/show-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: TableComponent
  },
  {
    path: 'nuevo',
    component: CreateComponent,
  },
  {
    path: ':id/editar',
    component: EditComponent,
    resolve: 
    {
        model: EditResolverService
    }
  },
  {
    path: ':id/detalles',
    component: ShowComponent,
    resolve: 
    {
        model: ShowResolverService
    }
  },
  {
    path: '**',
    component: TableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    EditResolverService,
    ShowResolverService
  ]
})
export class CompanyRoutingModule { }
