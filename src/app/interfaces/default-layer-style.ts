import { Model } from './model';

export interface DefaultLayerStyle extends Model
{
    name:string;
    geoserver_name:string;
    layer_id: number;
    config: {
        shape: string;
        color: string;
        size: number
    }
}
