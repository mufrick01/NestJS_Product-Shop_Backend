import { Socket } from "socket.io";
import { User } from "src/auth/entities";

export interface ConnectedClients {
    [id:string]:{ socket:Socket,user:User }
}