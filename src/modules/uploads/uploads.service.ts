import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadPropertyImageUseCase } from '@/application/uploads/use-cases/upload-property-image.use-case';

@Injectable()
export class UploadsService {
  constructor(
    private readonly uploadPropertyImageUseCase: UploadPropertyImageUseCase,
  ) {}

  uploadImage(file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'Arquivo de imagem obrigatório (campo "file").',
      );
    }

    return this.uploadPropertyImageUseCase.execute(file);
  }
}
