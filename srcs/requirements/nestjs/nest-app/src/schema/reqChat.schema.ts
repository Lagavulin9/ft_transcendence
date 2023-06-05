import * as Joi from "joi"

export const reqChatSchema = Joi.object({
	roomOwner: Joi.number().required(),
	roomType: Joi.number().default(0), // 0: public, 1: private, 2: protected
	roomName: Joi.string().required(),
	password: Joi.string() // 받고 나서 hash로 저장하는 방식
});
