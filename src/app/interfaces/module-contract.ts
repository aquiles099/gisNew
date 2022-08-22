import { Model } from './model';
import { Module } from './module';
import { HiringPlan } from './hiring-plan';
import { Project } from './project';

export interface ModuleContract extends Model
{
    readonly project_id: number;
    readonly module_id: number;
    readonly hiring_plan_id: number;
    readonly currency_id: number;
    readonly amount: number;
    readonly project?: Project;
    readonly module?: Module;
    readonly hiring_plan?: HiringPlan;
}
