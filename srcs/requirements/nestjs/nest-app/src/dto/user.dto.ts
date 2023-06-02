import * as Joi from "joi"

export class UserDto{
	readonly uid: number
	readonly nickname: string // Defalut: Intra NickName
	readonly isOTP: boolean
	readonly isAvatar: boolean
	readonly avatarIndex: number // Defalut: 0
	readonly totalWin: number // Defalut: 0
	readonly totalLose: number // Defalut: 0
	readonly level: number // Win의 10당 레벨 +1
}

export const UserSchema = Joi.object({
	uid: Joi.number().required(),
	nickname: Joi.string().required(), // Defalut: Intra NickName
	isOTP: Joi.boolean(),
	isAvatar: Joi.boolean(),
	avatarIndex: Joi.number(), // Defalut: 0
	totalWin: Joi.number(), // Defalut: 0
	totalLose: Joi.number(), // Defalut: 0
	level: Joi.number(), // Win의 10당 레벨 +1
});
