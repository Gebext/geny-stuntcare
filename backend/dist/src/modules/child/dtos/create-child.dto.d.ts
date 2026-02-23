export declare class CreateChildDto {
    name: string;
    gender: string;
    birthDate: string;
    birthWeight: number;
    birthLength: number;
    birthHeadCircumference?: number;
    birthArmCircumference?: number;
    asiExclusive: boolean;
}
export declare class UpdateChildDto {
    name?: string;
    gender?: string;
    birthDate?: string;
    birthWeight?: number;
    birthLength?: number;
    birthHeadCircumference?: number;
    birthArmCircumference?: number;
    asiExclusive?: boolean;
}
export declare class ChildFilterDto {
    name?: string;
    gender?: string;
    stuntingRisk?: string;
    page?: number;
    limit?: number;
}
