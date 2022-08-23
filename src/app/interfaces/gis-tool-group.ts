import { Model } from './model';
import { GisTool } from './gis-tool';

export interface GisToolGroup extends Model
{
    name: string;
    display_name: string;
    path: string;
    description: string;
    is_active: boolean;
    selected: boolean;
    order: number;
    gis_tools: GisTool[];
}