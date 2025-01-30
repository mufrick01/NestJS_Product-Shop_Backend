import { diskStorage } from 'multer';
import { Response } from 'express';
import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';



@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService:ConfigService
  ) {}

  @Post('product')
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

    const hostApi = this.configService.get('HOST_API') ?? 'http://localhost:3000/api'
    const secureUrl = `${hostApi}/files/product/${file.filename}`
    return {secureUrl};
  }


  // 

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName')imageName:string
  ){

    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile(path);

  }
  
}
