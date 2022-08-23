import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fadeInAnimation, fadeOutAnimation } from 'angular-animations';
import { BaseToolComponent } from '../base-tool/base-tool.component';
import { ToolService } from '../../../../../../services/gis/map/tool.service';
import { MapService } from '../../../../../../services/gis/map/map.service';
import { GisLayerService } from '@services/gis/gis-layer.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { GisLayer } from '../../../../../../models/gis-layer';
import { SpinnerService } from '@services/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { delayExecution, isNumeric, isset } from 'src/app/shared/helpers';
// import { ProjectLayersService } from '../../../../../../services/gis/project-layers.service';
import { MapLayerService } from '../../../../../../services/gis/map/map-layer.service';

@Component({  templateUrl: './feature-filter.component.html',
  styleUrls: ['./feature-filter.component.scss'],
  animations: [
    fadeInAnimation({duration: 500}),
    fadeOutAnimation({duration: 500})
  ],
  encapsulation: ViewEncapsulation.None
})
export class FeatureFilterComponent extends BaseToolComponent implements OnInit
{
  public attributes:any=[];
  public selectedLayer:GisLayer;
  private layers:GisLayer[] = [];
  public projectLayersSubscription: Subscription;
  public search:string = null;
  public propertyValues:Array<string|number> = [];
  public selectedLayerFilter:{[atributo:string]:Array<string|number>};
  private selectedPropertyData:any;
  public formData:any = {
    module:null,
    group:null,
    layer:null,
    property:null
  };
  public properties:Array<any> = [];
  public apiData:any;

  public spinnerShow: boolean = false;

  public isThereAnyLayerWithActiveFilter:boolean = false;

  constructor(
    protected toolService:ToolService,
    protected mapService:MapService,
    private _gisLayerService:GisLayerService,
    private _spinnerService: SpinnerService,
    private _toastrService:ToastrService,
    // private _projectLayersService:ProjectLayersService,
    private _mapLayerService:MapLayerService
  )
  {
    super(
      toolService,
      mapService
    );

    this.key = "feature-filter";
    this.cleanField();
  }
  ngOnInit(): void {
    this.isThereAnyLayerWithActiveFilter = this._mapLayerService.projectedLayers.length > 0;
  }

  async onChangeLayerSelector(layer: GisLayer)
  {
    if(layer) {
      this.selectedLayer = layer;
      this.formData.layer = layer;
      this.attributes = await this._gisLayerService.getAllowedAttributesPerTool(this.selectedLayer.id);
      this.selectedLayerFilter = layer.filterMap;
      if(this.attributes.length < 1){
        Swal.fire({
          icon: "info",
          title: "Error",
          text: "Debe configurar algún atributo para esta herramienta.",
          confirmButtonText: "OK",
          heightAuto: false
        });
      }
    }
    else
    {
      this.cleanField();
    }
  }

  cleanField() {
    this.selectedLayer = null;
    this.attributes = [];
    this.selectedPropertyData = null;
    this.propertyValues = [];
    this.search = null;
    this.formData.module = null;
    this.formData.group = null;
    this.formData.layer = null;
    this.formData.property = null;
  }

  public async updateFilter(value:string|number):Promise<void>
  {
    this._spinnerService.show();
    this.selectedLayer.updateFilter(this.selectedPropertyData.name, value );
    setTimeout(() => {
      this._spinnerService.hide();
    }, 500);
  }

  public valueExistsOnFilter(value:string|number):boolean
  {    
    return this.selectedLayerFilter[this.selectedPropertyData.name] ?
    this.selectedLayerFilter[this.selectedPropertyData.name].includes(value) ? true :
    false : false;
  }

  public onChangePropertySelector():void {
    this.selectedPropertyData = this.attributes.find(property => property.name === this.formData.property);
    this.propertyValues = this.selectedPropertyData.domain;
    this.search = null;
  }

  public selectedLayerHasFilterOnProperty():boolean
  {
    return this.selectedLayerFilter && Object.keys(this.selectedLayerFilter).length &&
    this.selectedLayerFilter[this.selectedPropertyData.name] ?
    this.selectedLayerFilter[this.selectedPropertyData.name].length > 0 :
    false;
  }

  private updateCqlFilterInSelectedLayer():void
  {
    let cqlFilter = "";

    if( ! this.selectedLayerFilter[this.selectedPropertyData.name].length )
      delete this.selectedLayerFilter[this.selectedPropertyData.name];

    for( let [property, values] of Object.entries(this.selectedLayerFilter))
    {
      if( cqlFilter.charAt(cqlFilter.length - 1) === ")" )
        cqlFilter += " AND ";

      values = values.map(value =>  isNumeric(value) ? value : `'${value}'`);

      cqlFilter += `"${property}" IN (${values.join(", ")})`;
    }

    isset(cqlFilter) ?
    this.selectedLayer.wms.wmsParams.cql_filter = cqlFilter :
    delete this.selectedLayer.wms.wmsParams.cql_filter;

    this.selectedLayer.refresh();
    this.cleanField();
    this.toolService.clearSelectLayer.emit(true);

  }

  public async removeFilterOnProperty():Promise<void>
  {
    this.selectedLayerFilter[this.selectedPropertyData.name] = [];
    this.updateCqlFilterInSelectedLayer();
  }

  public async removeFilterOnAllLayers():Promise<void>
  {
    try
    {
      this._spinnerService.show("Eliminando filtros...");

      await delayExecution(250);

      /* this._projectLayersService
          .obtenerCapas({modulo: null, grupo: null, proyectado: true})
          .forEach(capa => {
            delete capa.capaWms.wmsParams.cql_filter;
            capa.refrescar();
          }); */

      this.cleanField();

      //this._projectLayersService.notificarCambioEnObservador();

      this._toastrService.success("Filtros eliminados.","Exito!");

    } catch (error)
    {
      console.error(error);
      this._toastrService.error(error.message, "Error");
    }
    finally
    {
      this._spinnerService.hide();
    }
  }


}
