import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseType } from 'src/interfaces/global.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentImageDto } from './dto/CommentImage.dto';
import { UploadFileDto } from './dto/UploadImage.dto';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  async getImages(page: number, limit: number): Promise<ResponseType> {
    try {
      page = page ? page : 1;
      limit = limit ? limit : 3;

      const count = await this.prisma.images.count();
      const images = await this.prisma.images.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });
      return {
        statusCode: 200,
        message: 'Images fetched successfully',
        data: {
          count,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          images,
        },
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Lỗi không xác định', 400);
    }
  }

  async getImageByName(
    name: string,
    page: number,
    limit: number,
  ): Promise<ResponseType> {
    try {
      page = page ? page : 1;
      limit = limit ? limit : 3;
      const images = await this.prisma.images.findMany({
        where: {
          name: {
            contains: name,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      });
      const count = images.length;
      return {
        statusCode: 200,
        message: 'Images fetched successfully',
        data: {
          count,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          images,
        },
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Lỗi không xác định', 400);
    }
  }

  async getImageDetail(imgId: number): Promise<ResponseType> {
    try {
      if (!imgId) {
        throw new BadRequestException('Image id is invalid');
      }

      const imgDetail = await this.prisma.images.findUnique({
        where: {
          img_id: imgId,
        },
        include: {
          users: true,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user_id, users, ...imgDetaildResult } = imgDetail;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pw, ...userResult } = users;
      return {
        statusCode: 200,
        message: 'Images fetched successfully',
        data: {
          ...imgDetaildResult,
          user: userResult,
        },
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Lỗi không xác định', 400);
    }
  }

  async getCommentsImage(imgId: number): Promise<ResponseType> {
    try {
      if (!imgId) {
        throw new BadRequestException('Image id is empty or invalid');
      }
      const comments = await this.prisma.comments.findMany({
        where: {
          img_id: imgId,
        },
        include: {
          users: true,
        },
      });

      // Clean data
      const commentsResult = [];
      comments.map((comment) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { user_id, users, ...cmtResult } = comment;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _pw, ...userResult } = users;
        commentsResult.push({ ...cmtResult, user: userResult });
      });

      return {
        statusCode: 200,
        message: 'Comments fetched successfully',
        data: commentsResult,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Lỗi không xác định', 400);
    }
  }

  async saveImage(accessToken: string, imgId: number): Promise<ResponseType> {
    try {
      if (!accessToken) {
        throw new BadRequestException('Access token is required');
      }
      if (!imgId) {
        throw new BadRequestException('Image id is empty or invalid');
      }
      const decoded = await this.jwt.decode(accessToken);
      const { id: user_id } = decoded;
      if (!user_id) {
        throw new BadRequestException('Access token is missing user id');
      }
      const checkImage = await this.prisma.images.findUnique({
        where: {
          img_id: imgId,
        },
      });
      if (!checkImage) {
        throw new NotFoundException('Image not found');
      }

      const checkSaveImg = await this.prisma.save_img.findFirst({
        where: {
          user_id,
          img_id: imgId,
        },
      });

      if (checkSaveImg) {
        await this.prisma.save_img.delete({
          where: {
            id: checkSaveImg.id,
          },
        });
        return {
          statusCode: 200,
          data: {},
          message: 'Image was successfully unsaved',
          date: new Date(),
        };
      }
      await this.prisma.save_img.create({
        data: {
          user_id,
          img_id: imgId,
          date: new Date(),
        },
      });
      return {
        statusCode: 200,
        data: {},
        message: 'Image saved successfully',
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'L��i không xác đ��nh', 400);
    }
  }

  async isImgSavedById(
    imgId: number,
    accessToken: string,
  ): Promise<ResponseType> {
    try {
      if (!imgId) {
        throw new BadRequestException('Image id is empty or invalid');
      }

      if (!accessToken) {
        throw new BadRequestException('Access token is required');
      }
      await this.jwt.verify(accessToken);

      const decodedToken = this.jwt.decode(accessToken);
      const { id: user_id } = decodedToken;
      if (!user_id) {
        throw new BadRequestException('Access token is missing user id');
      }

      const checkSaved = await this.prisma.save_img.findFirst({
        where: {
          img_id: imgId,
          user_id,
        },
      });

      if (!checkSaved) {
        return {
          statusCode: 200,
          message: 'Image is not saved',
          data: {
            saved: false,
          },
          date: new Date(),
        };
      }

      const user = await this.prisma.users.findUnique({
        where: {
          user_id,
        },
      });

      return {
        statusCode: 200,
        message: 'Image is already saved by user ' + user.full_name,
        data: {
          saved: true,
        },
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Lỗi không xác định', 400);
    }
  }

  async commentImage(
    accessToken: string,
    commentImageDto: CommentImageDto,
  ): Promise<ResponseType> {
    try {
      const { imgId: img_id, comment: content } = commentImageDto;

      await this.jwt.verify(accessToken);
      const decodedToken = this.jwt.decode(accessToken);
      const { id: user_id } = decodedToken;
      if (!user_id) {
        throw new BadRequestException('Access token is missing user id');
      }

      const checkImg = await this.prisma.images.findUnique({
        where: {
          img_id: +img_id,
        },
      });

      const checkUser = await this.prisma.users.findUnique({
        where: {
          user_id,
        },
      });

      if (!checkImg) {
        throw new NotFoundException('Not found image with this id');
      }
      if (!checkUser) {
        throw new NotFoundException('Not found user with this id');
      }

      const newComment = await this.prisma.comments.create({
        data: {
          img_id: +img_id,
          user_id,
          content,
          date: new Date(),
        },
        include: {
          users: true,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user_id: _userId, users, ...commentResult } = newComment;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userResult } = users;

      return {
        statusCode: 200,
        message: 'Comment added successfully',
        data: { ...commentResult, user: userResult },
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Lỗi không xác định', 400);
    }
  }

  async getSavedImageByUser(accessToken: string): Promise<ResponseType> {
    try {
      if (!accessToken) {
        throw new BadRequestException('Access token is required');
      }
      await this.jwt.verify(accessToken);
      const decodedToken = this.jwt.decode(accessToken);
      const { id: user_id } = decodedToken;
      if (!user_id) {
        throw new BadRequestException('Access token is missing user id');
      }
      const savedImages = await this.prisma.save_img.findMany({
        where: {
          user_id,
        },
        include: {
          images: true,
        },
      });

      return {
        statusCode: 200,
        message: 'Saved images fetched successfully',
        data: savedImages,
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Lỗi không xác định', 400);
    }
  }

  async getImagesCreatedByUser(accessToken: string): Promise<ResponseType> {
    try {
      if (!accessToken) {
        throw new BadRequestException('Access token is required');
      }
      await this.jwt.verify(accessToken);
      const decodedToken = this.jwt.decode(accessToken);
      const { id: user_id } = decodedToken;
      if (!user_id) {
        throw new BadRequestException('Access token is missing user id');
      }
      const user = await this.prisma.users.findUnique({
        where: {
          user_id,
        },
      });
      if (!user) {
        throw new NotFoundException('Not found user with this id');
      }

      const images = await this.prisma.images.findMany({
        where: {
          user_id,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pw, ...userResult } = user;

      return {
        statusCode: 200,
        message: 'Images fetched successfully',
        data: {
          user: userResult,
          imagesCreated: images,
        },
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Lỗi không xác định', 400);
    }
  }

  async uploadImage(
    accessToken: string,
    file: Express.Multer.File,
    uploadFileDto: UploadFileDto,
  ): Promise<ResponseType> {
    try {
      if (!accessToken) {
        throw new BadRequestException('Access token is required');
      }
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      await this.jwt.verify(accessToken);
      const decodedToken = this.jwt.decode(accessToken);
      const { id: user_id } = decodedToken;
      if (!user_id) {
        throw new BadRequestException('Access token is missing user id');
      }
      const user = await this.prisma.users.findUnique({
        where: {
          user_id,
        },
      });
      if (!user) {
        throw new NotFoundException('Not found user with this id');
      }

      const { name, desc } = uploadFileDto;

      const newImage = await this.prisma.images.create({
        data: {
          user_id,
          name,
          desc,
          url: `/img/${file.filename}`,
        },
      });

      return {
        statusCode: 200,
        message: 'Image uploaded successfully',
        data: {
          newImage,
        },
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Lỗi không xác định', 400);
    }
  }

  async deleteImage(imgId: number): Promise<ResponseType> {
    try {
      if (!imgId) {
        throw new BadRequestException('Image id is empty or invalid');
      }
      const checkImg = await this.prisma.images.findUnique({
        where: {
          img_id: imgId,
        },
      });
      if (!checkImg) {
        throw new NotFoundException('Not found image with this id');
      }

      const checkCmt = await this.prisma.comments.findFirst({
        where: {
          img_id: imgId,
        },
      });
      const checkSaved = await this.prisma.save_img.findFirst({
        where: {
          img_id: imgId,
        },
      });

      if (checkCmt) {
        throw new BadRequestException('Image has comments, not delete');
      }
      if (checkSaved) {
        throw new BadRequestException('Image is saved by users, not delete');
      }

      await this.prisma.images.delete({
        where: {
          img_id: imgId,
        },
      });
      return {
        statusCode: 200,
        message: 'Image deleted successfully',
        data: {},
        date: new Date(),
      };
    } catch (error) {
      throw new HttpException(error.message || 'Lỗi không xác định', 400);
    }
  }
}
