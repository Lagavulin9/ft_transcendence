import { Socket } from "socket.io";

export class ReqSocketDto{
	client:Socket
	roomName:string
	target:string
	msg:string
	password:string
}