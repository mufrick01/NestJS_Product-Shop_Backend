import { Controller, Post, Body, Get, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities';
import { RawHeaders } from 'src/common/decorator/raw-headers.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { Auth, GetUser, RoleProtected } from './decorator';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto:LoginUserDto){
    return this.authService.login(loginUserDto)
  }


  @Get('private')
  @UseGuards(AuthGuard())
  privateRoute(
    @GetUser('email') email:string,
    @GetUser() user:User,
    @RawHeaders() rawHeaders:string[]
  ){
    return {ok:true,email,user,rawHeaders}
  }

  @Get('private2')
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  @UseGuards(AuthGuard(),UserRoleGuard)
  privateRoute2(
    @GetUser() user:User
  ){
    return {user:user}
  }

  @Get('private3')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  privateRoute3(
    @GetUser() user:User
  ){
    return {user:user}
  }

}
