import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
  Delete,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { multerOptions } from './multer.config';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: string,
  ) {
    return this.uploadService.uploadFile(file, folder);
  }

  @Delete()
  deleteFile(
    @Body('filename') filename: string,
    @Body('folder') folder: string,
  ) {
    return this.uploadService.deleteFile(filename, folder);
  }
}
