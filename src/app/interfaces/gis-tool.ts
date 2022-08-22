import { Model } from './model';

export interface GisTool extends Model
{
    "gis_tool_group_id": number;
    "name": string;
    "display_name": string;
    "path": string;
    "description": string;
    "selected": boolean;
    "is_active": boolean;
}