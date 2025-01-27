import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  logger = new Logger();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService:JwtService,
  ){}

  async register(createUserDto: CreateUserDto) {
    try {

      const {password,...restUserDTO} = createUserDto;

      const user = this.userRepository.create(
        {
          ...restUserDTO,
          password:bcrypt.hashSync(password,10)
        }
      );

      await this.userRepository.save(user);
      delete user.password;

      return {...user,token:this.getJwtToken({email: user.email})};


    } catch (error) {
      this.handleDbError(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const {password,email} = loginUserDto;
    const user = await this.userRepository.findOne(
      {
        where:{email},
        select:{email:true,password:true}

      }
    );

    if(!user){
      throw new UnauthorizedException('Not valid credentials')
    }
    if(!bcrypt.compareSync(password,user.password)){
      throw new UnauthorizedException('Not valid credentials')
    }

    delete user.password;
    return {...user,token:this.getJwtToken({email: user.email})};
  }


  private getJwtToken(payload:JwtPayload){
    return this.jwtService.sign(payload);
  }

  
  private handleDbError(error):never{
    if(error.code === '23505'){
      throw new BadRequestException(error.detail)
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs')
  }
}
