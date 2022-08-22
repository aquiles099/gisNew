export interface LaravelPaginator 
{
    readonly current_page: number;
    readonly data: any[];
    readonly first_page_url: string;
    readonly from: number;
    readonly last_page: number;
    readonly last_page_url: string;
    readonly links: PaginatorLink[];
    readonly next_page_url: string|null;
    readonly path: string;
    readonly per_page: number;
    readonly prev_page_url: string;
    readonly to: number;
    readonly total: number;
}

interface PaginatorLink
{
    readonly url: null;
    readonly label: string;
    readonly active: boolean;
}   