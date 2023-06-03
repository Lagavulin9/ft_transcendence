import * as Joi from "joi"

export const createUserSchema = Joi.object({
	nickname: Joi.string().required(), // Defalut: Intra NickName
	isOTP: Joi.boolean().default(false),
	isAvatar: Joi.boolean().default(false),
	avatarIndex: Joi.number().default(0), // Defalut: 0
});
