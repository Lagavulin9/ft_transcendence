import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Response } from 'express';
import { ImageService } from './image.service';
import { CreateFileValidationPipe } from './createValidation.pipe';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'static', // fixme: 쿨하지는 않은데 어쩔 수 없는듯...
        filename: (req, file, callback) => {
          const extension = file.originalname.split('.').pop();
          const extensionResult =
            extension === 'jpg' || extension === 'jpeg' ? '.jpg' : '.png';
          callback(null, randomStringGenerator() + extensionResult);
        },
      }),
    }),
  )
  async uploadImage(
    @UploadedFile(
      CreateFileValidationPipe(5000, RegExp('^image\\/(jpeg|png)$')),
    )
    file: Express.Multer.File,
    @Res() res: Response,
  ) {
    console.log('file');
    console.log(file);
    return await this.imageService.getSavedFileURL(file, res);
  }

  /**
   * 이 방법 말고 좋은 방법이 있을 것임.
   */
  @Get('/:filename')
  @UseGuards(JwtAuthGuard)
  serveImage(@Param('filename') filename: string, @Res() res: Response): void {
    return this.imageService.serveImage(filename, res);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  getDefaultImage(@Res() res: Response): void {
    return this.imageService.serveImage('default.jpeg', res);
  }
}
