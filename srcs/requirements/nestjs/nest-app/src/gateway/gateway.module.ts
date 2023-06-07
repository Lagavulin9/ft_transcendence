import { Module } from "@nestjs/common";
import { socketGateway } from "./gateway";

@Module({
	providers: [socketGateway]
})
export class Gateway{}