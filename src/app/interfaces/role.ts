import { Model } from './model';

export interface Role extends Model
{
    "name": string;
    "display_name": string;
    "description": string;
}
