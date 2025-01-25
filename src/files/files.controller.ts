import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors, } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';




@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('products')
  @UseInterceptors(
    FileInterceptor('file',{
      fileFilter, 
      storage:diskStorage({
        destination:'./static/products',
        filename:fileNamer  
      })
    }),
  )
  uploadProductImageFile(@UploadedFile()file:Express.Multer.File){

    if(!file){
      throw new BadRequestException('Make sure that the file is an image')
    }
    return {file:file.originalname};
  }
  
}
