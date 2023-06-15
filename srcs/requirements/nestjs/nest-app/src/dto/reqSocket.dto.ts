import { Socket } from "socket.io";
import { ResMsgDto } from "./msg.dto";

export class ReqSocketDto{
	roomName:string
	roomType:number
	target:string
	msg:string;
	password:string
}