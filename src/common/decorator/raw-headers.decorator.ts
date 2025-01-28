import { BadRequestException, createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { Request } from "express";

export const RawHeaders = createParamDecorator(
    (data, ctx:ExecutionContext)=>{

        const req:Request = ctx.switchToHttp().getRequest();
        return req.rawHeaders;
    }
)