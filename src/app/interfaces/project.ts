import { Model } from "./model"
import { Municipality } from './municipality';
import { FreeTrial } from './free-trial';
import { ModuleContract } from './module-contract';

export interface Project extends Model
{
    title: string;
    logo_path: string;
    company_id: number;
    municipality_id: number;
    is_active: boolean;
    img_path: string;
    logo_src: string;
    srid: number;
    last_access: string;
    favourite: boolean;
    municipality:Municipality;
    accesses_given?:{key:string, value:string}[];
    active_module_contracts?:ModuleContract[];
    free_trial?:FreeTrial;
}
