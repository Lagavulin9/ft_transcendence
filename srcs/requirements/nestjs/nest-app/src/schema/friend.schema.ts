import * as Joi from "joi"

export const reqFriendSchema = Joi.object({
	uid: Joi.number().required(),
	target: Joi.number().required()
})