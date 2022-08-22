import { Model } from './model';

export interface ProjectWorkModule extends Model
{
    name: string;
    display_name: string;
    description: string|null;
    is_active: boolean;
    key: string;
}
