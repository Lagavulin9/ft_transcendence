import * as Joi from "joi"

export const createUserSchema = Joi.object({
	uid: Joi.number().required(),
	nickname: Joi.string().required(), // Defalut: Intra NickName
	isOTP: Joi.boolean().default(0),
	isAvatar: Joi.boolean().default(0),
	avatarIndex: Joi.number().default(0), // Defalut: 0
	totalWin: Joi.number().default(0), // Defalut: 0
	totalLose: Joi.number().default(0), // Defalut: 0
	level: Joi.number().default(1), // Win의 10당 레벨 +1
});
