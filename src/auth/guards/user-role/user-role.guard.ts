import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorator';
import { User } from 'src/auth/entities';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){}



  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles:string[] = this.reflector.get(META_ROLES, context.getHandler())
    const req:Request = context.switchToHttp().getRequest();
    const user = req.user as User;

    if(!user){throw new BadRequestException('user not found')}
    if(!validRoles){ return true}
    if(validRoles.length===0){ return true}

    for (const role of user.roles) {
      if(validRoles.includes(role)){
        return true;
      }
    }


    throw new ForbiddenException(`user: ${user.fullName}, need a valid role [ ${validRoles} ]`)
  }
}
