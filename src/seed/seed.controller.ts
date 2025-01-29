import { Controller, Get, } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth, GetUser } from '../auth/decorator';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  executeSeed(){
    return this.seedService.runSeed();
  }
  
}
