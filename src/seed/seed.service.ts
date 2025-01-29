import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class SeedService {

    constructor(
      private readonly productService:ProductsService,
      @InjectRepository(User)
      private readonly userRepository:Repository<User>
    ){}

  async runSeed() {
    await this.DeleteUserDataOnTable()
    const adminUser = await this.insertUsers();
    await this.insertNewProducts(adminUser);
    return `SEED EXECUTED`
  }

  private async DeleteUserDataOnTable(){
    await this.productService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
            .delete()
            .where({})
            .execute();
  }

  private async insertUsers(){
    const seedUsers = initialData.users;
    const users:User[]=[];
    seedUsers.forEach(({password,...rest})=>{
      users.push(this.userRepository.create({
        ...rest,
        password:bcrypt.hashSync(password,10)
      }))
    })

    const dbUsers = await this.userRepository.save(users);

    return dbUsers.at(0);
  }
  

  private async insertNewProducts(user:User){
    this.productService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises = [];
    products.forEach((product)=>{
        insertPromises.push(this.productService.create(product,user))
    })

    await Promise.all(insertPromises)

    return true;
  }
  
}
