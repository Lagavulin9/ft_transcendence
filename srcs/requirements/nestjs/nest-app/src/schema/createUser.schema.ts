import * as Joi from 'joi';

export const createUserSchema = Joi.object({
  nickname: Joi.string().required(), // Defalut: Intra NickName
});
