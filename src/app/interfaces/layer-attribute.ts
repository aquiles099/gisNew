import { Model } from './model';

export type LayerAttributeType = "int" | "float" | "varchar" | "text" | "date" | "time" | "boolean";

export interface LayerAttribute  extends Model
{
    readonly name: string;
    readonly display_name: string;
    readonly layer_id: number;
    readonly data_type: LayerAttributeType;
    readonly default_value: string|null;
    readonly domain: (string|number|boolean)[];
    readonly order: number;
    readonly is_fixed: boolean;
}