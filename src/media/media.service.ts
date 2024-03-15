import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseType } from 'src/interfaces/global.interface';
import { PrismaService } from 'src/prisma/prisma.service';

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
      const count = await this.prisma.images.count();
      const images = await this.prisma.images.findMany({
        where: {
          name: {
            contains: name,
          },
        },
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
}
