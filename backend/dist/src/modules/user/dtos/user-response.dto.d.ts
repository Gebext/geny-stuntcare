import { User } from '@prisma/client';
export type UserResponseData = Omit<User, 'passwordHash' | 'roles' | 'motherProfile' | 'chatSessions'>;
export declare class UserResponseDto implements UserResponseData {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    passwordHash: string;
    constructor(partial: Partial<User>);
}
