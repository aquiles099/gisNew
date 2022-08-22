import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map.component';

// resolvers
import { MapResolverService } from '../../../../services/solvers/gis/map-resolver.service';

// tools

// feature curd
import { NewFeatureComponent } from './tools/new-feature/new-feature.component';
import { MoveFeatureComponent } from './tools/move-feature/move-feature.component';
import { EditFeatureComponent } from './tools/edit-feature/edit-feature.component';
import { EditMultipleFeaturesComponent } from './tools/edit-multiple-features/edit-multiple-features.component';
import { CopyFeatureComponent } from './tools/copy-feature/copy-feature.component';
import { DeleteFeatureComponent } from './tools/delete-feature/delete-feature.component';

// information
import { FeatureInformationComponent } from './tools/feature-information/feature-information.component';
import { FeatureLabelingComponent } from './tools/feature-labeling/feature-labeling.component';
import { FeatureFilterComponent } from './tools/feature-filter/feature-filter.component';

const routes: Routes = [
  {
    path: '',
    component: MapComponent,
    resolve: {
      resources: MapResolverService
    },
    children: [
      // feature crud
      {
        path: "nuevo-elemento",
        component: NewFeatureComponent
      },
      {
        path: "mover-elemento",
        component: MoveFeatureComponent
      },
      {
        path: "editar-elemento",
        component: EditFeatureComponent
      },
      {
        path: "editar-multiples-elementos",
        component: EditMultipleFeaturesComponent
      },
      {
        path: "copiar-elemento",
        component: CopyFeatureComponent
      },
      {
        path: "eliminar-elemento",
        component: DeleteFeatureComponent
      },
      // information
      {
        path: "informacion-de-elemento",
        component: FeatureInformationComponent
      },
      {
        path: "etiquetar-elementos",
        component: FeatureLabelingComponent
      },
      {
        path: "filtro-de-elementos",
        component: FeatureFilterComponent
      },
    ]
  },
  {
    path: '**',
    component: MapComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    MapResolverService
  ]
})
export class MapRoutingModule { }
