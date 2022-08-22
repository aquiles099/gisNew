import {User as UserInterface} from '../interfaces/user';
import { Company } from '../interfaces/company';
import { Role } from '../interfaces/role';
import { isset } from '../shared/helpers';

export class User
{
    public id: number;
    public first_name: string;
    public last_name: string;
    public user_name: string;
    public email: string;
    public company_id: number;
    public telephone: string|null;
    public identification_document: string;
    public profile_photo_path: string|null;
    public is_active: boolean;
    public email_verified_at: string|null;
    public full_name: string;
    public profile_photo_src: string;
    public company: Company;
    public roles?: Role[];

    constructor(data:UserInterface)
    {
        for(let [key, value] of Object.entries(data))
                (this as any)[key] = value;
    }
    
    get fullNameInitials():string
    {
        return this.first_name.split(" ")[0][0].toUpperCase() + this.last_name.split(" ")[0][0].toUpperCase();
    }

    get hasSomeAdminRole():boolean
    {
        return this.isAdmin || this.isCompanyAdmin;
    }

    get isAdmin():boolean
    {
        const adminRole = this.roles.find(role => role.name === 'admin');
        return isset(adminRole);
    }
  
    get isCompanyAdmin():boolean
    {
        const adminRole = this.roles.find(role => role.name === 'company_admin');
        return isset(adminRole);
    }      
}
