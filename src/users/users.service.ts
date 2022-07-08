import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { DataSource, MongoRepository } from 'typeorm';
import { MONGO_CONNECTION } from 'src/connections/mongo.module';

@Injectable()
export class UsersService {
  private userRepository: MongoRepository<User>;
  constructor(@Inject(MONGO_CONNECTION) private connection: DataSource) {
    this.userRepository = this.connection.getMongoRepository(User);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      isActive: true,
    });
    await this.userRepository.save(user);
    return user;
  }

  async getUserById(id: string): Promise<User> {
    return await this.userRepository.findOneBy(id);
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async deleteById(id: string) {
    return this.userRepository.delete(id);
  }
}
