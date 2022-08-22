import { NgModule } from '@angular/core';
import { MapRoutingModule } from './map-routing.module';
import { SharedModule } from '../../../../shared/shared.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

//
import { MapComponent } from './map.component';
import { HeaderComponent } from './header/header.component';
import { ButtonBarComponent } from './button-bar/button-bar.component';
import { ToolSidebarComponent } from './tool-sidebar/tool-sidebar.component';

// tools
import { BaseToolComponent } from './tools/base-tool/base-tool.component';
import { LayerControllerComponent } from './tools/layer-controller/layer-controller.component';
import { NewFeatureComponent } from './tools/new-feature/new-feature.component';
import { EditFeatureComponent } from './tools/edit-feature/edit-feature.component';
import { EditMultipleFeaturesComponent } from './tools/edit-multiple-features/edit-multiple-features.component';
import { MoveFeatureComponent } from './tools/move-feature/move-feature.component';
import { CopyFeatureComponent } from './tools/copy-feature/copy-feature.component';
import { DeleteFeatureComponent } from './tools/delete-feature/delete-feature.component';
import { FeatureInformationComponent } from './tools/feature-information/feature-information.component';
import { FeatureLabelingComponent } from './tools/feature-labeling/feature-labeling.component';
import { FeatureGaleryComponent } from './tools/feature-galery/feature-galery.component';
import { FeatureFilterComponent } from './tools/feature-filter/feature-filter.component';
import { LayerCategorizationComponent } from './tools/layer-categorization/layer-categorization.component';
import { FeatureTableComponent } from './tools/feature-table/feature-table.component';
import { AnalysisChartsComponent } from './tools/analysis-charts/analysis-charts.component';

// helpers
import { FeatureFinderComponent } from './tools/helpers/feature-finder/feature-finder.component';
import { LayerHighlighterComponent } from './tools/helpers/layer-highlighter/layer-highlighter.component';
import { DrawLayerComponent } from './tools/helpers/draw-layer/draw-layer.component';
import { LayerSelectorComponent } from './tools/helpers/layer-selector/layer-selector.component';

// services
import { MapService } from '../../../../services/gis/map/map.service';
import { MapResourceService } from '../../../../services/gis/map/map-resource.service';
import { MapLayerService } from '../../../../services/gis/map/map-layer.service';
import { ToolService } from '../../../../services/gis/map/tool.service';
import { FeatureService } from '../../../../services/gis/map/feature.service';
import { GisLayerService } from '../../../../services/gis/gis-layer.service';

@NgModule({
  declarations: [
    MapComponent,
    HeaderComponent,
    ButtonBarComponent,
    ToolSidebarComponent,
    // tools
    LayerControllerComponent,
    BaseToolComponent,
    NewFeatureComponent,
    MoveFeatureComponent,
    EditFeatureComponent,
    DeleteFeatureComponent,
    EditMultipleFeaturesComponent,
    CopyFeatureComponent,
    FeatureInformationComponent,
    // helpers
    FeatureFinderComponent,
    LayerHighlighterComponent,
    DrawLayerComponent,
    LayerSelectorComponent,
    FeatureLabelingComponent,
    FeatureGaleryComponent,
    FeatureFilterComponent,
    LayerCategorizationComponent,
    FeatureTableComponent,
    AnalysisChartsComponent,
  ],
  imports: [
    SharedModule,
    MapRoutingModule,
    LeafletModule,
    LeafletDrawModule,
    TypeaheadModule,
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  providers: [
    MapService,
    MapResourceService,
    MapLayerService,
    ToolService,
    FeatureService,
    GisLayerService
  ]
})
export class MapModule { }
