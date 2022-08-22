import { Model } from './model';

export interface FreeTrial extends Model
{
    readonly company_id:number;
    municipality_id:number;
    readonly user_id:number;
    readonly project_id:number;
}
