import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateUserInfoDto {
  @ApiProperty({ required: false })
  @IsString()
  email?: string;
  @ApiProperty({ required: false })
  @IsString()
  password?: string;
  @ApiProperty({ required: false })
  @IsString()
  fullName?: string;
  @ApiProperty({ required: false })
  @IsNumber()
  age?: number;
  @ApiProperty({ required: false })
  @IsString()
  avatar?: string;
}
