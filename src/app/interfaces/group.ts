import { Model } from './model';
import { Layer } from './layer';
import { GisLayer } from '../models/gis-layer';

export interface Group extends Model
{
    readonly name: string;
    readonly module_id: number;
    readonly display_name: string;
    readonly logo_path: string;
    active_gis_layers?: Layer[];
    gis_layers?: GisLayer[];
    layers?: Layer[];
}
