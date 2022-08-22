import { Model } from './model';

export interface HiringPlan extends Model
{
    readonly name: string;
    readonly description: string;
    readonly price: number;
    readonly allowed_accesses: number;
}