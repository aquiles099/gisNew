import { Component, NgZone } from '@angular/core';
import { ToolService } from '../../../../../../services/gis/map/tool.service';
import { MapService } from '../../../../../../services/gis/map/map.service';
import { MapLayerService } from '../../../../../../services/gis/map/map-layer.service';
import { FeatureService } from '../../../../../../services/gis/map/feature.service';
import { GisLayerService } from '../../../../../../services/gis/gis-layer.service';
import { LayerAttribute } from '../../../../../../interfaces/layer-attribute';
import { FeatureFinderComponent } from '../helpers/feature-finder/feature-finder.component';
import { SpinnerService } from '@services/spinner.service';
import { GeoJSONHelper } from '@models/gis/geojson-helper';
@Component({
  selector: 'edit-information',
  templateUrl: './edit-feature.component.html',
  styleUrls: ['./edit-feature.component.scss',
    '../../../../../../../styles/map/tool.scss'
  ]
})
export class EditFeatureComponent extends FeatureFinderComponent {

  public elementSelect: any = [];
  public editFeature: { [key: string]: string | number | boolean } = {};
  public atributteFeature: LayerAttribute[] = [];
  public attLayer: LayerAttribute[] = [];
  public showHeader: boolean = true;

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
    this.key = "edit-feature";

    this.startCallback = () => {
      ;
      console.log(this.layerFeatures);
    };

    this.middleCallback = () => {
      ;
    };

    this.endCallback = () => {
      ;
    };

    this.startSearchOnInit = true;
  }

  public async onSelectElement(feature: any, layerId: number) {

    this.onSelectFeature(layerId, feature);

    const data = await this.featureService.getElementSelect(feature.id, layerId);
    this.attLayer = await this.gisLayerService.getAllowedAttributesPerTool(layerId);

    this.selectedFeature = data;
    this.featureService.setUrlParams({ layerId: layerId.toString() });

  }

  public onNext() {
    this.showInfo = false;
  }

  public onBack() {
    this.showInfo = true;
  }

  public onCanceld() {
    this.showHeader = true;
    this.layerFeatures = [];
  }

  public async onSubmit(): Promise<void> {

    try {

      this.buildFeatureFormModel();
      this.formatAttributeDataByDataType();
      this.editFeature['geom'] = GeoJSONHelper.geometryToWkt(this.selectedFeature['geom']);
      console.log(this.editFeature);
      await this.featureService.update(this.selectedFeature.id, this.editFeature);

    }
    finally {
      // this._spinnerService.hide();
    }

  }

  public buildFeatureFormModel(): void {
    for (let attr of this.attLayer)
      this.editFeature[attr.name] = this.selectedFeature[attr.name];
  }

  private formatAttributeDataByDataType(): void {
    for (let attribute of this.attLayer) {
      switch (attribute.data_type) {
        case "time":
          break;
        case "int":
          this.editFeature[attribute.name] = Number.parseInt(this.editFeature[attribute.name].toString());
          break;
        case "float":
          this.editFeature[attribute.name] = Number.parseFloat(this.editFeature[attribute.name].toString());
          break;
        case "date":
          break;
        case "boolean":
          this.editFeature[attribute.name] = this.editFeature[attribute.name] === "false" ? 0 : 1;
          break;
      }
    }
  }

}
