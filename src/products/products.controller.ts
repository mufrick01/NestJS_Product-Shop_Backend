import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, BadRequestException, NotFoundException, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth, GetUser } from '../auth/decorator';
import { ValidRoles } from '../auth/interfaces';
import { User } from '../auth/entities';
import { Product } from './entities';


@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiResponse({status:201,description:'Product was created',type:Product})
  @ApiResponse({status:400,description:'BadRequest'})
  @ApiResponse({status:403,description:'Forbidden, token related'})
  @Auth(ValidRoles.admin,ValidRoles.superUser)
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user:User
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(@Query()paginationDto:PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  async findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin,ValidRoles.superUser)
  update(@Param('id', ParseUUIDPipe) id: string, 
         @Body() updateProductDto: UpdateProductDto,
         @GetUser() user:User
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin,ValidRoles.superUser)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
