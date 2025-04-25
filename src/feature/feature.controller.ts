import { FileInterceptor } from '@nestjs/platform-express';
import { FeatureService } from './feature.service';
import {
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';

@Controller('feature')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/*',
        })
        .addMaxSizeValidator({
          maxSize: (1024 * 1024) / 2,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.featureService.uploadImage(file);
  }

  @Get('images')
  getImages() {
    return this.featureService.getImages();
  }

  @Get('export')
  async exportLessons(@Res() res: Response) {
    try {
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=lessons.zip',
      });

      await this.featureService.streamLessonsZip(res);
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ err: 'error' });
    }
  }
}
