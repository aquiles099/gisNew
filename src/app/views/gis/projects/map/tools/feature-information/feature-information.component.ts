import { Component, NgZone } from '@angular/core';
import { ToolService } from '../../../../../../services/gis/map/tool.service';
import { MapService } from '../../../../../../services/gis/map/map.service';
import { MapLayerService } from '../../../../../../services/gis/map/map-layer.service';
import { FeatureService } from '../../../../../../services/gis/map/feature.service';
import { FeatureFinderComponent } from '../helpers/feature-finder/feature-finder.component';
import { GisLayerService } from '@services/gis/gis-layer.service';
import { LayerAttribute } from '@interfaces/layer-attribute';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { delayExecution } from '@shared/helpers';

@Component({
  selector: 'feature-information',
  templateUrl: './feature-information.component.html',
  styleUrls: [
    './feature-information.component.scss',
    '../../../../../../../styles/map/tool.scss'
  ],
  animations: [
    fadeInOnEnterAnimation({duration: 250}),
    fadeOutOnLeaveAnimation({duration: 250})
  ]
})
export class FeatureInformationComponent extends FeatureFinderComponent
{
  public featureInfo:{[key:string]:string|number};
  public atributteFeature: LayerAttribute[] = [];
  public attLayer: LayerAttribute[] = [];

  constructor(
    protected toolService: ToolService,
    protected mapService: MapService,
    protected featureService: FeatureService,
    protected mapLayerService: MapLayerService,
    protected gisLayerService: GisLayerService,
    protected ngZone: NgZone
  ) {

    super(
      toolService,
      mapService,
      featureService,
      mapLayerService,
      ngZone
    );

    this.key = "feature-info";

    this.startCallback = () => {
      this.showSpinner = true;
      this.featureInfo = null;
    };

    this.middleCallback = async () => {

      try
      {
        if (this.thereIsOnlyOneFeature())
         await this.showFeatureInfo();
      }
      catch (error)
      {
        this.attLayer = [];
        this.selectedFeature = null;
      }
    };

    this.endCallback = () => this.showSpinner = false;

    this.startSearchOnInit = true;
  }

  public async showFeatureInfo():Promise<void>
  {
    try
    {
      this.showInfo = this.showSpinner = true;

      this.attLayer = await this.gisLayerService.getAllowedAttributesPerTool(this.layerIdOfSelectedFeature);

      this.featureInfo = await this.featureService.getElementSelect(this.selectedFeature.id, this.layerIdOfSelectedFeature);

    }
    catch(error)
    {
      this.showInfo = false;
    }
    finally
    {
      this.showSpinner = false;
    }
  }

  public async onBack():Promise<void>
  {
    this.featureInfo = null;

    // leve retraso para que se vea trasicion de animacion fadeIn.
    await delayExecution(250); 

    this.showInfo = false;
  }
}