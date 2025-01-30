import { Injectable } from '@nestjs/common';
import { ConnectedClients } from './interfaces/connected-clients.interface';
import { Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesWsService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>,
    ){

    }

    private connectedClients:ConnectedClients = {}

    async registerClient(client:Socket, userId:string){

        const user = await this.userRepository.findOneBy({id:userId})

        if(!user){
            client.disconnect();
            throw new Error('user not found')
        }

        if(!user.isActive){
            throw new Error('user is not active, contact with an admin')
        }

        this.checkUserConnections(user)
        this.connectedClients[client.id] = {socket:client,user};

        
    }
    removeClient(clientId:string){
        delete this.connectedClients[clientId];
    }

    getConnectedClients():string[]{
        return Object.keys(this.connectedClients)
    }

    getUserFullNameBySocketId(socketId:string){
        return this.connectedClients[socketId].user.fullName;
    }

    private checkUserConnections(user:User){
        for (const clientId of Object.keys(this.connectedClients)) {
            
            const connectedClient = this.connectedClients[clientId]

            if(connectedClient.user.id === user.id){
                // this.removeClient(clientId);
                connectedClient.socket.disconnect();
                break;
            }


        }
    }

}
