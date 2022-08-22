import { Layer, LayerGeometryType } from '../interfaces/layer';
import LeafletWms from 'leaflet.wms';
import { Map, TileLayer } from 'leaflet';
import { DefaultLayerStyle } from '../interfaces/default-layer-style';
import { GisLayer as ProjectGisLayer } from '../interfaces/gis-layer';
import { isNumeric, isset } from '../shared/helpers';

export class GisLayer
{
  public id: number;
  public name: string;
  public module_id: number;
  public group_id: number;
  public display_name: string;
  public geometry_type: LayerGeometryType;
  public logo_path: string;
  public gis_layer:ProjectGisLayer;
  public custom_layer_style:any; // aun no definido
  public default_layer_style:DefaultLayerStyle;
  projected:boolean = false;
  legendImageSrc:string;
  wms:LeafletWms|TileLayer;
  geoserverUrl:string;
  map:Map;

  private filter:{[key:string]:(string | number)[]} = {};
  
  constructor(
      data:Layer,
      geoserverUrl:string,
      map:Map
  )
  {
      for(let [key, value] of Object.entries(data))
          (this as any)[key] = value;

      this.geoserverUrl = geoserverUrl;

      this.map = map;

      this.setWms(data);

      this.setLegendImageSrc(data);
  }

  get geoserverKey():string
  {
    return this.gis_layer.geoserver_name;
  }

  get filterMap()
  {
    return this.filter;
  }

  // map

  private setLegendImageSrc(layer:Layer):void
  {
    const requestParams:{[key:string]:string|number} = {
      REQUEST:"GetLegendGraphic",
      transparent:"true",
      style:layer.default_layer_style.geoserver_name,
      SCALE:2000,
      VERSION:"1.0.0",
      FORMAT:"image/png",
      LAYER: layer.gis_layer.geoserver_name,
      LEGEND_OPTIONS:"fontName:Raleway;fontSize:14;columns:1;forceLabels:on;fontAntiAliasing:true;"
    }; 

    let imgUrl = this.geoserverUrl;

    for( let [key, value] of Object.entries( requestParams ) )
      imgUrl += `${key}=${value}&`;

    this.legendImageSrc = imgUrl;
  }
  
  private setWms(layer:Layer):void
  {
    const wmsLayer = LeafletWms.overlay(this.geoserverUrl, {
      layers: layer.gis_layer.geoserver_name,
      styles: layer.default_layer_style.geoserver_name,
      className: null,
      format: 'image/gif',
      crossOrigin: true,
      transparent: true,
      opacity: layer.geometry_type.includes("POLYGON") ? .5 : 1,
      maxNativeZoom: 22,
      maxZoom: 22,
      tiled: false
    });

    this.wms = wmsLayer;
  }

  public remove():void
  {
    this.map.removeLayer(this.wms);
    this.projected = false;
  }
  
  public add():void
  {
    this.map.addLayer(this.wms);
    this.projected = true;
  }

  // label

  public getLabel():string
  {
    return this.wms.wmsParams.env ? 
    this.wms.wmsParams.env.substring( this.wms.wmsParams.env.indexOf(":") + 1) :
    null;      
  }

  public addLabel(attr:string):void
  {
    this.wms.setParams({
      env: `label:${attr}`,
      fake: Date.now()
    });
  }

  public removeLabel():void
  {
    delete this.wms.wmsParams.env;
    this.refresh();
  }

  // filter

  public async updateFilter(attrName:string, value:string|number):Promise<void>
  {
    if( this.attributeExistsOnFilter(attrName) )
    {
      this.filter[attrName] = this.valueExistsOnFilter(attrName, value) ?
      this.filter[attrName].filter(_value => _value !== value) :
      [...this.filter[attrName], value];
    }
    else
    {
      this.filter[attrName] = [value];
    }

    this.updateCqlFilterInSelectedLayer();
  }

  public attributeExistsOnFilter(attrName:string):boolean
  {
    return isset(this.filter[attrName]);
  }
 
  public valueExistsOnFilter(attrName:string, value:string|number):boolean
  {
    return this.filter[attrName].includes(value);
  }

  public async removeAttributeFromFilter(attrName:string):Promise<void>
  {
    delete this.filter[attrName];
    this.updateCqlFilterInSelectedLayer();
  }

  private updateCqlFilterInSelectedLayer():void
  {
    let cqlFilter = "";

    for( let [attribute, values] of Object.entries(this.filter))
    {
      if( values.length )
      {
        if( cqlFilter.charAt(cqlFilter.length - 1) === ")" )
          cqlFilter += " AND ";
  
        values = values.map(value =>  isNumeric(value) ? value : `'${value}'`);
  
        cqlFilter += `"${attribute}" IN (${values.join(', ')})`;
      }
      else
      {
        delete this.filter[attribute];
      }
    }

    isset(cqlFilter) ?
    this.wms.wmsParams.cql_filter = cqlFilter :
    delete this.wms.wmsParams.cql_filter;

    this.refresh();
  }

  // self

  public refresh():void
  {
    this.wms.setParams(({fake: Date.now()} as any));
  } 
}
