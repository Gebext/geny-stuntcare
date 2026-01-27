import { ChildFilterDto, CreateChildDto } from '../dtos/create-child.dto';
import { ChildService } from '../services/child-service';
export declare class ChildController {
    private readonly childService;
    constructor(childService: ChildService);
    findAll(query: ChildFilterDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            lastPage: number;
        };
    }>;
    create(req: any, dto: CreateChildDto): Promise<any>;
    getMyChildren(req: any): Promise<any>;
    update(req: any, id: string, dto: any): Promise<any>;
    verify(id: string, risk: string): Promise<any>;
    getDetail(id: string): Promise<any>;
}
