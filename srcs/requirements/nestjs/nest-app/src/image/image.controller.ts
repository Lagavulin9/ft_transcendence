import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Response } from 'express';
import { ImageService } from './image.service';
import { CreateFileValidationPipe } from './createValidation.pipe';

@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post('/')
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
  ) {
    console.log(file);
    return await this.imageService.getSavedFileURL(file);
  }

  /**
   * 이 방법 말고 좋은 방법이 있을 것임.
   */
  @Get('/:filename')
  serveImage(@Param('filename') filename: string, @Res() res: Response): void {
    return this.imageService.serveImage(filename, res);
  }

  @Get('/')
  getDefaultImage(@Res() res: Response): void {
    return this.imageService.serveImage('default.png', res);
  }
}
