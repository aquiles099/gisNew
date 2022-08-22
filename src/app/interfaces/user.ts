import { Model } from './model';
import { Company } from './company';
import { Role } from './role';

export interface User extends Model
{
    "first_name": string;
    "last_name": string;
    "user_name": string;
    "email": string;
    "company_id": number;
    "telephone": string|null;
    "identification_document": string;
    "profile_photo_path": string|null;
    "is_active": boolean;
    "email_verified_at": string|null;
    "full_name": string;
    "profile_photo_src": string;
    "company"?: Company,
    "roles"?: Role[],
}
