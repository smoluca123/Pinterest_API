import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CommentImageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  comment: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  imgId: string;
}
