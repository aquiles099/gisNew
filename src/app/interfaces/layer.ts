import { Model } from './model';
import { GisLayer } from './gis-layer';
import { DefaultLayerStyle } from './default-layer-style';

export type LayerGeometryType = "POINT" | "LINESTRING" | "POLYGON" | "MULTILINESTRING" | "MULTIPOLYGON";

export interface Layer extends Model
{
    readonly name: string;
    module_id?: number;
    readonly group_id: number;
    readonly display_name: string;
    label?: string;
    readonly geometry_type: LayerGeometryType;
    readonly logo_path: string;
    readonly gis_layer?:GisLayer;
    readonly custom_layer_style?:any; // aun no definido
    readonly default_layer_style?:DefaultLayerStyle;
}
