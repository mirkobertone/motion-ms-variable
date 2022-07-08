import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  isActive: boolean;

  @IsEmail()
  email: string;
}
