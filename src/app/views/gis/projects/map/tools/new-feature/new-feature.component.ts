import { Component, OnInit, NgZone } from '@angular/core';
import { DrawLayerComponent } from '../helpers/draw-layer/draw-layer.component';
import { ToolService } from '../../../../../../services/gis/map/tool.service';
import { MapService } from '../../../../../../services/gis/map/map.service';
import { MapLayerService } from '../../../../../../services/gis/map/map-layer.service';
import { GisLayer } from '../../../../../../models/gis-layer';
import { GisLayerService } from '../../../../../../services/gis/gis-layer.service';
import { LayerAttribute } from '../../../../../../interfaces/layer-attribute';
import { esLocale}  from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { FeatureService } from '../../../../../../services/gis/map/feature.service';
import { SpinnerService } from '../../../../../../services/spinner.service';
import { GeoJSONHelper } from '../../../../../../models/gis/geojson-helper';
import { ToastrService } from 'ngx-toastr';
import { fadeInAnimation, fadeOutAnimation } from 'angular-animations';
defineLocale('es', esLocale);

@Component({
  templateUrl: './new-feature.component.html',
  styleUrls: [
    './new-feature.component.scss',
    '../../../../../../../styles/map/tool.scss'
  ],
  animations: [
    fadeInAnimation({duration: 500}),
    fadeOutAnimation({duration: 500})
  ]
})
export class NewFeatureComponent extends DrawLayerComponent implements OnInit
{
  protected onFinishDrawing: () => void = async  () => {
    
    try
    {
      this.layerAttributes = [];

      this.showSpinner = true;

      this.helpMessage = "";
  
      this.layerAttributes = await this._gisLayerService.getAllowedAttributesPerTool(
        this.gisLayer.id
      );

      this.buildFeatureFormModel();

    }
    finally
    {
      this.showSpinner = false;
    }

  };

  public layerAttributes:LayerAttribute[] = [];

  constructor(
    protected toolService:ToolService,    
    protected mapService:MapService,    
    protected ngZone:NgZone,
    private _mapLayerService:MapLayerService,
    private featureService:FeatureService,
    private _gisLayerService:GisLayerService,
    private _bsLocaleService:BsLocaleService,
    private _spinnerService:SpinnerService,
    private toastrService:ToastrService,
  )
  {
    super(
      toolService,    
      mapService,    
      ngZone
    );

    this._bsLocaleService.use('es');

    this.key = "new-feature";
  }

  public onChangeLayerSelector(layer:GisLayer):void
  {
    this.gisLayer = layer;
    this.featureService.setUrlParams({layerId: layer.id.toString()});
  }

  public buildFeatureFormModel():void
  {
    for( let attr of this.layerAttributes )
      this.newFeature[attr.name] = attr.default_value;
  }

  public async onSubmit():Promise<void>
  {
    try
    {
        this._spinnerService.show([
          'Creando elemento...',
          'Por favor, espere...'
        ]);

        this.formatAttributeDataByDataType();

        this.newFeature['geom'] = GeoJSONHelper.geometryToWkt( this.newLayer.toGeoJSON().geometry );

        await this.featureService.store(this.newFeature);

        this.toastrService.success('Elemento creado.','OK');

        this.gisLayer.refresh();

        this.zoomBeforeFocusOnLayer = null;

        this.clear();
    }
    finally
    {
      this._spinnerService.hide();
    }
  }

  private formatAttributeDataByDataType():void
  {
    for( let attribute of this.layerAttributes )
    {
      switch( attribute.data_type )
      {
        case "time":
          break;
        case "int":
          this.newFeature[attribute.name] = Number.parseInt(this.newFeature[attribute.name].toString());
          break;
        case "float":
          this.newFeature[attribute.name] = Number.parseFloat(this.newFeature[attribute.name].toString());
          break;
        case "date":
          break;
        case "boolean":
          this.newFeature[attribute.name] = this.newFeature[attribute.name] === "false" ? 0 : 1;
          break;
      }
    }
  }
}
