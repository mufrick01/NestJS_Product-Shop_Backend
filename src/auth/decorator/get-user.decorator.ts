import { BadRequestException, createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { Request } from "express";

export const GetUser = createParamDecorator(
    (data, ctx:ExecutionContext)=>{

        const req:Request = ctx.switchToHttp().getRequest();
        const user = req.user;

        if(!user){
            throw new InternalServerErrorException('User not found (request)');
        }

        return (!data) 
                ? user
                : user[data]
    }
)