import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

const ALLOWED_FOLDERS = ['blogs', 'avatar', 'product'];

export const multerOptions = {
  storage: diskStorage({
    destination: (req: Request, _file, callback: DestinationCallback) => {
      const folder = req.query.folder as string;

      if (!folder || !ALLOWED_FOLDERS.includes(folder)) {
        return callback(
          new BadRequestException(
            `Geçersiz veya eksik klasör parametresi. İzin verilenler: ${ALLOWED_FOLDERS.join(', ')}`,
          ),
          '',
        );
      }

      const uploadPath = `./uploads/${folder}`;

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      callback(null, uploadPath);
    },
    filename: (_req, file, callback: DestinationCallback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    if (file.mimetype.match(/^image\/(jpg|jpeg|png|gif|webp)$/)) {
      callback(null, true);
    } else {
      callback(
        new HttpException('Unsupported file format', HttpStatus.BAD_REQUEST),
        false,
      );
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
