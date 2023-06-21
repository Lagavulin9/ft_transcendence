import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { Response } from 'express';

@Injectable()
export class ImageService {

  serveImage(filename: string, res: Response) {
    const filePath = '/app/static/' + filename;
	console.log(filePath);
    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
      res.sendFile(filePath, { root: '/' });
    } else {
      throw new NotFoundException('not exists');
    }
  }

  async getSavedFileURL(img: Express.Multer.File): Promise<string> {
    return `/api/image/${img.filename}`;
  }
}