import { Model } from './model';

export interface GisLayer extends Model 
{
    layer_id: number;
    name: string;
    geoserver_name: string;
    is_active: boolean;
    custom_layer_style_id: number;
}
