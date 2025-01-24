import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import {validate as isUUID } from 'uuid'

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository:Repository<Product>,
  ){}

  async create(createProductDto: CreateProductDto) {
    try {
     
      const product = this.productRepository.create(createProductDto)
      await this.productRepository.save(product);

      return product;

    } catch (error) {
      
      this.handleDbExceptions(error);
    }
  }

  

  async findAll(paginationDto:PaginationDto) {
    const {limit = 10,offset=0} = paginationDto;
    return await this.productRepository.find({
      take:limit,
      skip:offset,
      // TODO: RELACIONES
    })
  }

  async findOne(term: string) {

      let product;
      if(isUUID(term)){
        product = await this.productRepository.findOneBy({id:term});
      }else{
        product = await this.productRepository.findOneBy({slug:term});
      }

      if(!product){
        throw new NotFoundException(`product with id: [${term}] not found`)
      }
      return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    
    await this.productRepository.delete(product.id);

    return product;

  }


  private handleDbExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    if (error.code === '22P02') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(`[${error.code}] ${error.detail} => ${error}`);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
