import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from 'src/modules/user/dtos/create-user.dto';
import { UserResponseDto } from 'src/modules/user/dtos/user-response.dto';
import { UpdateUserDto } from 'src/modules/user/dtos/update-user.dto';
import { UserQueryDto } from '../dtos/user-query.dto';
export declare class UserService {
    private userRepository;
    constructor(userRepository: UserRepository);
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    findAll(query: UserQueryDto): Promise<any>;
    findOne(id: string): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    remove(id: string): Promise<UserResponseDto>;
}
