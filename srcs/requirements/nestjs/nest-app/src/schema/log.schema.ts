import * as Joi from "joi"

export const LogSchema = Joi.object({
	fromId: Joi.number().required(),
	toId: Joi.number().required(),
	fromScore: Joi.number(),
	toScore: Joi.number(),
	score: Joi.array().items(Joi.number()).required()
});
