import { Component, NgZone } from '@angular/core';
import { ToolService } from '../../../../../../services/gis/map/tool.service';
import { MapService } from '../../../../../../services/gis/map/map.service';
import { MapLayerService } from '../../../../../../services/gis/map/map-layer.service';
import { FeatureService } from '../../../../../../services/gis/map/feature.service';
import { FeatureFinderComponent } from '../helpers/feature-finder/feature-finder.component';

@Component({
  selector: 'feature-information',
  templateUrl: './feature-information.component.html',
  styleUrls: [
    './feature-information.component.scss'
  ]
})
export class FeatureInformationComponent extends FeatureFinderComponent
{
  public showSpinner:boolean = false;

  constructor(
    protected toolService:ToolService,
    protected mapService:MapService,
    protected mapLayerService:MapLayerService,
    protected featureService:FeatureService,
    protected ngZone:NgZone
  )
  {
    super(
      toolService,
      mapService,
      featureService,
      mapLayerService,
      ngZone
    );

    this.key = "feature-info";

    this.startCallback = () => {
    };

    this.endCallback = () => {
    };

    this.startSearchOnInit = true;
  }

}
