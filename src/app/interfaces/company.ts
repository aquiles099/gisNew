import { Model } from './model';
import { User } from './user';
import { Municipality } from './municipality';

export type CompanySector = "maintenance" | "consultancy" | "administration" | "others";

export interface Company extends Model 
{
    "name": string;
    "fiscal_id": string;
    "image_path": string;
    "municipality_id": number;
    "telephone": string|null;
    "is_active": boolean;
    "sector": CompanySector;
    "type": "legal"|"personal";
    "image_src": string;
    "administrators": Partial<User>[];
    "municipality": Municipality;
}