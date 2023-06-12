import { Socket } from "socket.io";

export class ReqSocketDto{
	roomName:string
	roomType:number
	target:string
	msg:string
	password:string
}