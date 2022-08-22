import { Province } from './province';
import { SpatialRefSys } from './spatial-ref-sys';

export interface Municipality
{
    id: number;
    province_id: number;
    name: string;
    crs: number;
    geometry?: number[][];
    box2D?: number[][];
    province?: Province;
    image_src?: string;
    spatial_ref_sys?: SpatialRefSys
}
