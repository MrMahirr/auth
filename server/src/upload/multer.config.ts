import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';

// Güvenlik: Kullanıcı kafasına göre klasör adı yazamasın, sadece bunlara izin verelim.
const ALLOWED_FOLDERS = ['blogs', 'users', 'products', 'others'];

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      // 1. Frontend'den gelen ?folder= parametresini okuyoruz
      const folder = req.query.folder as string;

      // 2. Klasör ismi geçerli mi kontrol ediyoruz (Güvenlik Önlemi)
      if (!folder || !ALLOWED_FOLDERS.includes(folder)) {
        return callback(
          new BadRequestException(
            `Geçersiz veya eksik klasör parametresi. İzin verilenler: ${ALLOWED_FOLDERS.join(', ')}`,
          ),
          null as any,
        );
      }

      // 3. Kayıt yapılacak tam yolu belirliyoruz
      const uploadPath = `./uploads/${folder}`;

      // 4. Eğer klasör yoksa (örn: uploads/blogs), otomatik oluşturuyoruz
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
      // Dosya ismini benzersiz yapıyoruz (cakışmayı önlemek için)
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${uniqueSuffix}${ext}`);
    },
  }),
  // Sadece resim dosyalarına izin veriyoruz
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return callback(new Error('Sadece resim dosyaları yüklenebilir!'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // Maksimum 5MB dosya boyutu
  },
};
