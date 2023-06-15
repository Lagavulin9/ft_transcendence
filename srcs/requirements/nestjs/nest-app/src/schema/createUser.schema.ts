import * as Joi from "joi"

export const createUserSchema = Joi.object({
	nickname: Joi.string().required(), // Defalut: Intra NickName
	isOTP: Joi.boolean().default(false),
	profileURL: Joi.string()
});
