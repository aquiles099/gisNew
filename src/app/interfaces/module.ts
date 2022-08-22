import { Model } from './model';
import { Group } from './group';

export interface Module extends Model
{
    readonly name: string;
    readonly display_name: string;
    readonly logo_path: string;
    groups_with_active_gis_layers?: Group[];
    groups?: Group[];
}