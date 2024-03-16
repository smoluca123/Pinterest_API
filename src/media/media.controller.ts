import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { ResponseType } from 'src/interfaces/global.interface';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CommentImageDto } from './dto/CommentImage.dto';

@ApiTags('Media Management')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('/get-images')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getImages(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<ResponseType> {
    return this.mediaService.getImages(+page, +limit);
  }

  @Get('/get-images-by-name')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getImage(
    @Query('name') name: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<ResponseType> {
    return this.mediaService.getImageByName(name, +page, +limit);
  }

  @Get('/get-image-detail/:imgId')
  getImageDetail(@Param('imgId') imgId: string): Promise<ResponseType> {
    return this.mediaService.getImageDetail(+imgId);
  }

  @Get('/get-comments-image/:imgId')
  getCommentsImage(@Param('imgId') imgId: string): Promise<ResponseType> {
    return this.mediaService.getCommentsImage(+imgId);
  }

  @Get('/check-img-saved-by-id/:imgId')
  isImgSavedById(
    @Param('imgId') imgId: string,
    @Headers('accessToken') accessToken: string,
  ): Promise<ResponseType> {
    return this.mediaService.isImgSavedById(+imgId, accessToken);
  }

  @Post('/comment-image/')
  commentImage(
    @Headers('accessToken') accessToken: string,
    // @Query('imgId') imgId: string,
    // @Query('comment') comment: string,
    @Body() commentImageDto: CommentImageDto,
  ) {
    return this.mediaService.commentImage(accessToken, commentImageDto);
  }
}
