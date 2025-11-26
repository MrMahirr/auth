import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';

const ALLOWED_FOLDERS = ['blogs', 'users', 'products', 'others'];

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      const folder = req.query.folder as string;

      if (!folder || !ALLOWED_FOLDERS.includes(folder)) {
        return callback(
          new BadRequestException(
            `Geçersiz veya eksik klasör parametresi. İzin verilenler: ${ALLOWED_FOLDERS.join(', ')}`,
          ),
          null as any,
        );
      }

      const uploadPath = `./uploads/${folder}`;

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return callback(new Error('Sadece resim dosyaları yüklenebilir!'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
