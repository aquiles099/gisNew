import { Component, NgZone } from '@angular/core';
import { ToolService } from '../../../../../../services/gis/map/tool.service';
import { MapService } from '../../../../../../services/gis/map/map.service';
import { FeatureService } from '@services/gis/map/feature.service';
import { MapLayerService } from '@services/gis/map/map-layer.service';
import { GisLayerService } from '../../../../../../services/gis/gis-layer.service';
import { MoveFeatureComponent as MoveFeatureHelperComponent } from '../helpers/move-feature/move-feature.component';

@Component({
  templateUrl: './move-feature.component.html',
  styleUrls: [
    './move-feature.component.scss',
    '../../../../../../../styles/map/tool.scss'
  ]
})
export class MoveFeatureComponent extends MoveFeatureHelperComponent {
  constructor(
    protected toolService: ToolService,
    protected mapService: MapService,
    protected featureService: FeatureService,
    protected gisLayerService: GisLayerService,
    protected mapLayerService: MapLayerService,
    protected ngZone: NgZone
  ) {
    super(
      toolService,
      mapService,
      featureService,
      mapLayerService,
      ngZone
    );

    this.key = "move-feature";

    this.startCallback = () => {
    };

    this.endCallback = () => {

      console.log(this.layerFeatures);

    };

    this.startSearchOnInit = true;

  }


  public selected_item: any = null;

  addMarker(feature_id) {


    let selected_lay = this.layerFeatures.filter(layer => {
      return layer.features.some(feature => feature.id === feature_id);

    }
    );


    let feature = selected_lay[0].features.find(el => {
      return el.id == feature_id;
    });

    this.onSelectFeature(selected_lay[0].layer_id, feature);

  }


}
