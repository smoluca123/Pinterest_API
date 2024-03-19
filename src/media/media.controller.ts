import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { ResponseType } from 'src/interfaces/global.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CommentImageDto } from './dto/CommentImage.dto';
import { AdminGuard } from 'src/guards/admin.guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadFileDto } from './dto/UploadImage.dto';
import { extname } from 'path';

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

  @Get('/get-saved-image-by-user')
  getSavedImageByUser(
    @Headers('accessToken') accessToken: string,
  ): Promise<ResponseType> {
    return this.mediaService.getSavedImageByUser(accessToken);
  }

  @Get('/get-images-created-by-user')
  getImagesCreatedByUser(
    @Headers('accessToken') accessToken: string,
  ): Promise<ResponseType> {
    return this.mediaService.getImagesCreatedByUser(accessToken);
  }

  @Post('/upload-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: (
          req: any,
          file: Express.Multer.File,
          callback: (error: Error, filename: string) => void,
        ) => {
          callback(null, new Date().getTime() + '_' + file.originalname);
        },
      }),
      fileFilter(req, file, callback) {
        const ext = extname(file.originalname).toLowerCase().substring(1);
        const allowTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'ico'];
        if (!allowTypes.includes(ext)) {
          callback(null, false);
          req.fileValidationError = 'File type not allowed';
          return;
        }
        callback(null, true);
      },
    }),
  )
  uploadImage(
    @UploadedFile()
    file: Express.Multer.File,
    @Req() req: any,
    @Headers('accessToken') accessToken: string,
    @Body() uploadFileDto: UploadFileDto,
  ): Promise<ResponseType> {
    if (req.fileValidationError) {
      throw new UnprocessableEntityException(req.fileValidationError);
    }
    return this.mediaService.uploadImage(accessToken, file, uploadFileDto);
  }

  @UseGuards(AdminGuard)
  @Delete('/delete-images/:imgId')
  deleteImage(
    @Headers('accessToken') accessToken: string,
    @Param('imgId') imgId: string,
  ): Promise<ResponseType> {
    return this.mediaService.deleteImage(+imgId);
  }
}
