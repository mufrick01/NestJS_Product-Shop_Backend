import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({cors:true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wsServer:Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService:JwtService
  ) {}
  
  
  async handleConnection(client: Socket) {
    const token:string = client.handshake.headers.authentication as string;
    let payload:JwtPayload;

    try {

      payload = this.jwtService.verify(token)
      await this.messagesWsService.registerClient(client, payload.id);
      
    } catch (error) {
      client.disconnect();
      return;
    }


    this.wsServer.emit('clients-updated',this.messagesWsService.getConnectedClients())
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    this.wsServer.emit('clients-updated',this.messagesWsService.getConnectedClients())
  }

  // [message-from-client] event
  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client:Socket, payload:NewMessageDto){
    
    // ! solo a cliente
    // client.emit('message-from-server',{
    //   fullName:'yo',
    //   message:payload.message || 'no-message'
    // });

    // ! a todos menos a cliente
    // client.broadcast.emit('message-from-server',{
    //   fullName:'yo',
    //   message:payload.message || 'no-message'
    // });

    // ! a todos incluyendo al cliente
    this.wsServer.emit('message-from-server',{
      fullName:this.messagesWsService.getUserFullNameBySocketId(client.id),
      message:payload.message || 'no-message'
    });

  }
}

